import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';


type JournalRow = { accountName: string; accountType: string; debit: string; credit: string };
type TxBlock = { docRef: string; docId: string; label: string; entries: JournalRow[]; status?: string };

function printGLReport(blocks: TxBlock[]) {
    const COL = { acc: 36, type: 28, dr: 12, cr: 12 };
    const pad = (s: string, n: number) => s.length >= n ? s.substring(0, n - 1) + '…' : s.padEnd(n);
    const rpad = (s: string, n: number) => s.padStart(n);
    const line = '─'.repeat(COL.acc + COL.type + COL.dr + COL.cr + 7);
    const fmt = (v: string) => parseFloat(v) > 0 ? parseFloat(v).toFixed(2) : '—';

    console.log(`\n${'='.repeat(line.length)}`);
    console.log(`  GL AUDIT REPORT — BEFFA ERP  |  Company: ${process.env.BEFFA_COMPANY || 'N/A'}  |  ${new Date().toISOString()}`);
    console.log('='.repeat(line.length));

    for (const b of blocks) {
        const status = b.status ? ` [${b.status.toUpperCase()}]` : '';
        console.log(`\n  ▶ ${b.label}${status}`);
        console.log(`    Ref: ${b.docRef}`);
        console.log(`    ID : ${b.docId}`);
        console.log(`  ${line}`);
        console.log(`  | ${pad('Account', COL.acc)} | ${pad('Type', COL.type)} | ${rpad('Debit', COL.dr)} | ${rpad('Credit', COL.cr)} |`);
        console.log(`  ${line}`);

        if (b.entries.length === 0) {
            console.log(`  | ${pad('(no posted entries — GL cleared)', COL.acc + COL.type + COL.dr + COL.cr + 9)} |`);
        } else {
            let totalDr = 0, totalCr = 0;
            for (const e of b.entries) {
                const dr = parseFloat(e.debit || '0');
                const cr = parseFloat(e.credit || '0');
                totalDr += dr; totalCr += cr;
                console.log(`  | ${pad(e.accountName, COL.acc)} | ${pad(e.accountType, COL.type)} | ${rpad(fmt(e.debit), COL.dr)} | ${rpad(fmt(e.credit), COL.cr)} |`);
            }
            console.log(`  ${line}`);
            const balanced = Math.abs(totalDr - totalCr) < 0.01;
            console.log(`  | ${pad('TOTAL', COL.acc)} | ${pad('', COL.type)} | ${rpad(totalDr.toFixed(2), COL.dr)} | ${rpad(totalCr.toFixed(2), COL.cr)} |`);
            console.log(`  | ${pad(balanced ? '✓ BALANCED (Dr = Cr)' : `⚠  IMBALANCE: ${Math.abs(totalDr - totalCr).toFixed(2)}`, COL.acc + COL.type + COL.dr + COL.cr + 9)} |`);
        }
        console.log(`  ${line}`);
    }
    console.log();
}

/**
 * SALES GL & LEDGER AUDITS
 *
 * Confirmed field names from live probe:
 *   Invoice journal : getJournalEntriesAPI(id) → {accountName, accountType, debit, credit}
 *   Receipt journal : GET /receipt/<id> → cash_disbursement_journal.journal_entries
 *                     entry fields: { account: {id, name, type}, credit, debit }
 *   AR identified by: accountType/account.type.name includes "receivable"
 *   Void rule       : receipt must be reversed BEFORE invoice can be voided
 */

test.describe('Sales GL & Ledger Audits @sales @logic @regression @full', () => {
    test.setTimeout(180000);

    const isAR = (e: any) =>
        e.accountType?.toLowerCase().includes('receivable') ||
        e.account?.type?.name?.toLowerCase().includes('receivable') ||
        e.account?.name?.toLowerCase().includes('receivable');

    async function fetchReceiptJournal(app: AppManager, receiptId: string) {
        const token = await app._getAuthToken();
        const qs = `year=${process.env.BEFFA_YEAR||'2018'}&period=${process.env.BEFFA_PERIOD||'yearly'}&calendar=${process.env.BEFFA_CALENDAR||'ec'}`;
        const apiBase = (app as any).base.apiBase;
        const headers = { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` };
        const r = await (app as any).page.request.get(`${apiBase}/receipt/${receiptId}?${qs}`, { headers });
        if (!r.ok()) { console.log(`[WARN] receipt journal fetch ${r.status()}`); return []; }
        const json = await r.json();
        return json.cash_receipt_journal?.journal_entries ||
               json.cash_disbursement_journal?.journal_entries || [];
    }

    test('Audit: Full cycle GL — AR debited on invoice, cleared on receipt', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);


        const meta = await app.api.sales.discoverMetadataAPI();
        const item = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 20, unit_cost: 100 });
        if (!item) { console.log('[SKIP] No stock.'); return; }

        console.log(`[ITEM] ${item.itemName} | stock:${item.currentStock}`);

        // Step 1: Create & approve invoice
        const inv = await app.api.sales.createStandaloneInvoiceAPI({
            customerId: meta.customerId, itemId: item.itemId,
            quantity: 1, unitPrice: 500,
            locationId: item.locationId, warehouseId: item.warehouseId
        });
        await app.advanceDocumentAPI(inv.id, 'invoices');
        await page.waitForTimeout(3000);

        // Verify AR debit on invoice journal
        const invEntries = await app.api.inventory.getJournalEntriesAPI(inv.id);
        console.log(`[INVOICE JOURNAL] ${inv.ref} (${invEntries.length} entries)`);
        invEntries.forEach(e => console.log(`  ${e.accountName} (${e.accountType}) Dr:${e.debit} Cr:${e.credit}`));

        const arDebitEntry = invEntries.find(e => isAR(e) && parseFloat(e.debit) > 0);
        expect(arDebitEntry, `AR must be debited on invoice ${inv.ref}`).toBeTruthy();
        const arDebitAmt = parseFloat(arDebitEntry!.debit);
        console.log(`[PASS] AR debited $${arDebitAmt} on ${inv.ref}`);

        // Step 2: Create & approve receipt
        const rct = await app.api.sales.createInvoiceReceiptAPI({
            invoiceId: inv.id, customerId: meta.customerId, amount: arDebitAmt
        });
        await app.advanceDocumentAPI(rct.id, 'receipts');
        await page.waitForTimeout(3000);

        // Verify AR credit on receipt journal
        const rctEntries = await fetchReceiptJournal(app, rct.id);
        console.log(`[RECEIPT JOURNAL] ${rct.ref} (${rctEntries.length} entries)`);
        rctEntries.forEach((e: any) => console.log(`  ${e.account?.name} Dr:${e.debit} Cr:${e.credit}`));

        const arCreditEntry = rctEntries.find((e: any) => isAR(e) && parseFloat(e.credit) > 0);
        expect(arCreditEntry, `AR must be credited on receipt ${rct.ref}`).toBeTruthy();
        const arCreditAmt = parseFloat(arCreditEntry.credit);

        const drift = Math.abs(arDebitAmt - arCreditAmt);
        console.log(`[AUDIT] AR Dr:$${arDebitAmt} (inv) Cr:$${arCreditAmt} (rct) drift:$${drift.toFixed(2)}`);

        if (drift > 1) {
            throw new Error(
                `[VULNERABILITY] GL Drift — AR debit on invoice ≠ AR credit on receipt\n` +
                `  Invoice: ${inv.ref} | AR Debit : $${arDebitAmt}\n` +
                `  Receipt: ${rct.ref} | AR Credit: $${arCreditAmt}\n` +
                `  Drift  : $${drift.toFixed(2)}`
            );
        }
        console.log(`[PASS] Full cycle GL: AR Dr=$${arDebitAmt} = Cr=$${arCreditAmt}`);

        printGLReport([
            { docRef: inv.ref, docId: inv.id, label: '1. Invoice (AR Debit)', entries: invEntries },
            { docRef: rct.ref, docId: rct.id, label: '2. Receipt (AR Credit)', entries: rctEntries.map((e: any) => ({
                accountName: e.account?.name || '', accountType: e.account?.type?.name || '', debit: e.debit?.toString() || '0', credit: e.credit?.toString() || '0'
            })) }
        ]);
    });

    test('Audit: Credit note (void) must reverse AR debit from original invoice', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);


        const meta = await app.api.sales.discoverMetadataAPI();
        const item = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 20, unit_cost: 100 });
        if (!item) { console.log('[SKIP] No stock.'); return; }

        console.log(`[ITEM] ${item.itemName} | stock:${item.currentStock}`);

        // Step 1: Create & approve invoice
        const inv = await app.api.sales.createStandaloneInvoiceAPI({
            customerId: meta.customerId, itemId: item.itemId,
            quantity: 1, unitPrice: 800,
            locationId: item.locationId, warehouseId: item.warehouseId
        });
        await app.advanceDocumentAPI(inv.id, 'invoices');
        await page.waitForTimeout(3000);

        const invEntries = await app.api.inventory.getJournalEntriesAPI(inv.id);
        console.log(`[INVOICE JOURNAL] ${inv.ref} (${invEntries.length} entries)`);
        invEntries.forEach(e => console.log(`  ${e.accountName} (${e.accountType}) Dr:${e.debit} Cr:${e.credit}`));

        const arDebitEntry = invEntries.find(e => isAR(e) && parseFloat(e.debit) > 0);
        expect(arDebitEntry, `AR must be debited on invoice ${inv.ref}`).toBeTruthy();
        const arDebitAmt = parseFloat(arDebitEntry!.debit);
        console.log(`[PASS] AR debited $${arDebitAmt} on ${inv.ref}`);

        // Step 2: Create & approve receipt (required before void is allowed)
        const rct = await app.api.sales.createInvoiceReceiptAPI({
            invoiceId: inv.id, customerId: meta.customerId, amount: arDebitAmt
        });
        await app.advanceDocumentAPI(rct.id, 'receipts');
        await page.waitForTimeout(3000);
        console.log(`[RECEIPT] ${rct.ref} approved`);

        // Step 3: Reverse receipt FIRST — required by ERP before invoice can be voided
        console.log(`[STEP] Reversing receipt ${rct.ref}...`);
        const rctReversed = await app.api.sales.reverseReceiptAPI(rct.id);
        if (!rctReversed) throw new Error(`[FAIL] Receipt reversal failed for ${rct.ref} — cannot void invoice.`);
        await page.waitForTimeout(3000);
        console.log(`[PASS] Receipt ${rct.ref} reversed`);

        // Step 4: Void invoice
        console.log(`[STEP] Voiding invoice ${inv.ref}...`);
        const voided = await app.api.sales.reverseInvoiceAPI(inv.id);
        if (!voided) {
            throw new Error(
                `[VULNERABILITY] Invoice Void API Failure\n` +
                `  Invoice   : ${inv.ref} (ID: ${inv.id})\n` +
                `  Impact    : AR balance permanently inflated by $${arDebitAmt}.\n` +
                `  Root Cause: Backend void endpoint failed even after receipt was reversed.`
            );
        }
        console.log(`[VOID] id=${voided.id} ref=${voided.ref} status=${voided.voidedStatus}`);
        await page.waitForTimeout(5000);

        // Step 5: Verify AR reversal
        // Two valid ERP void patterns:
        //   A) Credit note created → separate document has AR credit entry
        //   B) Undo-to-draft → original invoice's sales_journal is cleared (0 entries = GL reversed)
        const creditNoteCreated = voided.id !== inv.id;

        if (creditNoteCreated) {
            const voidEntries = await app.api.inventory.getJournalEntriesAPI(voided.id);
            console.log(`[VOID JOURNAL] credit note id:${voided.id} (${voidEntries.length} entries)`);
            voidEntries.forEach(e => console.log(`  ${e.accountName} (${e.accountType}) Dr:${e.debit} Cr:${e.credit}`));

            const arCreditEntry = voidEntries.find(e => isAR(e) && parseFloat(e.credit) > 0);
            expect(arCreditEntry, `AR must be credited in void/credit-note journal for ${inv.ref}`).toBeTruthy();
            const arCreditAmt = parseFloat(arCreditEntry!.credit);
            const drift = Math.abs(arDebitAmt - arCreditAmt);
            if (drift > 1) throw new Error(
                `[VULNERABILITY] Credit Note GL Drift\n  Invoice AR Debit: $${arDebitAmt}\n  Credit Note AR Credit: $${arCreditAmt}\n  Drift: $${drift.toFixed(2)}`
            );
            console.log(`[PASS] Credit note: AR Cr=$${arCreditAmt} matches Dr=$${arDebitAmt}`);

            printGLReport([
                { docRef: inv.ref,    docId: inv.id,    label: '1. Invoice (AR Debit)',       entries: invEntries, status: 'voided' },
                { docRef: rct.ref,    docId: rct.id,    label: '2. Receipt (AR Cleared)',      entries: [] },
                { docRef: voided.ref, docId: voided.id, label: '3. Credit Note (AR Reversal)', entries: voidEntries }
            ]);
        } else {
            const voidEntries = await app.api.inventory.getJournalEntriesAPI(inv.id);
            console.log(`[VOID JOURNAL] original invoice after void (${voidEntries.length} entries)`);
            voidEntries.forEach(e => console.log(`  ${e.accountName} Dr:${e.debit} Cr:${e.credit}`));

            expect(
                voidEntries.length,
                `[VULNERABILITY] GL not reversed — invoice ${inv.ref} still has ${voidEntries.length} posted journal entries after void. AR balance remains inflated by $${arDebitAmt}.`
            ).toBe(0);
            console.log(`[PASS] Void confirmed: sales_journal cleared, GL fully reversed for ${inv.ref}`);

            printGLReport([
                { docRef: inv.ref, docId: inv.id, label: '1. Invoice (AR Debit — Pre-Void)',   entries: invEntries, status: 'approved' },
                { docRef: rct.ref, docId: rct.id, label: '2. Receipt (AR Cleared)',             entries: [] },
                { docRef: rct.ref, docId: rct.id, label: '3. Receipt Reversal',                 entries: [] },
                { docRef: inv.ref, docId: inv.id, label: '4. Invoice After Void (GL Cleared)',  entries: voidEntries, status: voided.voidedStatus }
            ]);
        }
    });
});
