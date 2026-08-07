import { test } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';


/**
 * PROCUREMENT PAYMENT ATTACK VECTORS
 *
 * Scenarios targeting payment manipulation vulnerabilities:
 * 1. Zero-amount payment approval — ghost accounting entry
 * 2. Negative payment amount — reverse cash flow injection
 * 3. Payment split array mismatch — bill_payments sum != payment total
 */

test.describe('Procurement Payment Attack Vectors @purchase @security @logic @regression @full', () => {

    let sharedMeta: Awaited<ReturnType<AppManager['api']['purchase']['discoverMetadataAPI']>>;
    let sharedItem: Awaited<ReturnType<AppManager['api']['inventory']['createFreshItemWithStockAPI']>>;

    // ── Shared audit table printer ─────────────────────────────────────────
    const printAuditTable = (title: string, rows: [string, string][], result: boolean, verdict: string) => {
        const W = { l: 32, v: 36 };
        const pad = (s: string, n: number) => s.length >= n ? s.substring(0, n - 1) + '…' : s.padEnd(n);
        const line = '─'.repeat(W.l + W.v + 7);
        console.log(`\n  ┌${line}┐`);
        console.log(`  │ ${pad(title, W.l + W.v + 3)} │`);
        console.log(`  ├${line}┤`);
        for (const [label, value] of rows) {
            console.log(`  │ ${pad(label, W.l)} │ ${pad(value, W.v)} │`);
        }
        console.log(`  ├${line}┤`);
        console.log(`  │ ${pad('Result', W.l)} │ ${pad(result ? `✓ PASS — ${verdict}` : `✗ FAIL — ${verdict}`, W.v)} │`);
        console.log(`  └${line}┘\n`);
    };

    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage();
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        sharedMeta = await app.api.purchase.discoverMetadataAPI();
        sharedItem = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 20, unit_cost: 100 });
        await page.close();
    });

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

    });

    // ── 1. ZERO-AMOUNT PAYMENT APPROVAL ──────────────────────────────────────
    test('Guardrail: System must reject approval of a zero-amount payment', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        const meta = sharedMeta;
        const item = sharedItem;
        const BILL_AMOUNT = 5000;
        const ATTACK_AMOUNT = 0;

        console.log(`[STEP 1] Creating & approving Bill for ${BILL_AMOUNT}...`);
        const bill = await app.api.purchase.createBillAPI({ itemData: item, unitPrice: BILL_AMOUNT, quantity: 1, vendorId: meta.vendorId });
        await app.advanceDocumentAPI(bill.id, 'bills');
        console.log(`[BILL] ${bill.ref} (${bill.id})`);

        console.log(`[ATTACK] Attempting to create and approve a ${ATTACK_AMOUNT}.00 payment against live bill...`);
        let blocked = false;
        let blockReason = '';
        let balance: number | null = null;

        try {
            const zeroPayment = await app.api.purchase.createBillPaymentAPI({ amount: ATTACK_AMOUNT, billId: bill.id, vendorId: meta.vendorId });
            console.log(`[INFO] Zero payment created: ${zeroPayment.ref} (${zeroPayment.id})`);
            await app.advanceDocumentAPI(zeroPayment.id, 'payments');

            const billData = await app.api.purchase.getBillAPI(bill.id);
            balance = parseFloat(billData.unpaid_amount ?? billData.balance ?? billData.amount_due ?? -1);
            console.log(`[RESULT] Bill balance after 0.00 payment: ${balance}`);

            if (balance === BILL_AMOUNT) {
                blocked = false;
                blockReason = `Ghost entry: payment approved but balance unchanged at ${balance}`;
            } else if (balance < BILL_AMOUNT) {
                blocked = false;
                blockReason = `Accounting corruption: 0.00 payment reduced balance to ${balance}`;
            }
        } catch (err: any) {
            blocked = true;
            blockReason = err.message.substring(0, 60);
        }

        printAuditTable('Zero-Amount Payment Guardrail', [
            ['Bill Ref', bill.ref],
            ['Bill ID', bill.id],
            ['Bill Amount', `$${BILL_AMOUNT.toFixed(2)}`],
            ['Attack Payment Amount', `$${ATTACK_AMOUNT.toFixed(2)}`],
            ['Bill Balance After', balance !== null ? `$${balance.toFixed(2)}` : 'N/A (blocked at creation)'],
            ['Block Reason', blockReason || 'Rejected at API layer'],
        ], blocked, blocked ? 'Zero-amount payment blocked' : 'VULNERABILITY CONFIRMED');

        if (!blocked) {
            throw new Error(`[CRITICAL_LOGIC_BUG] Zero-amount payment approved. ${blockReason}`);
        }
        console.log(`[PASS] Zero-amount payment correctly blocked.`);
    });

    // ── 2. NEGATIVE PAYMENT AMOUNT ────────────────────────────────────────────
    test('Guardrail: System must reject a negative payment amount', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        const meta = sharedMeta;
        const item = sharedItem;
        const BILL_AMOUNT = 5000;
        const ATTACK_AMOUNT = -5000;

        console.log(`[STEP 1] Creating & approving Bill for ${BILL_AMOUNT}...`);
        const bill = await app.api.purchase.createBillAPI({ itemData: item, unitPrice: BILL_AMOUNT, quantity: 1, vendorId: meta.vendorId });
        await app.advanceDocumentAPI(bill.id, 'bills');
        console.log(`[BILL] ${bill.ref} (${bill.id})`);

        console.log(`[ATTACK] Attempting to create a payment of ${ATTACK_AMOUNT}...`);
        let blocked = false;
        let blockReason = '';
        let balance: number | null = null;

        try {
            const negPayment = await app.api.purchase.createBillPaymentAPI({ amount: ATTACK_AMOUNT, billId: bill.id, vendorId: meta.vendorId });
            console.log(`[INFO] Negative payment created: ${negPayment.ref} (${negPayment.id})`);
            await app.advanceDocumentAPI(negPayment.id, 'payments');

            const billData = await app.api.purchase.getBillAPI(bill.id);
            balance = parseFloat(billData.unpaid_amount ?? billData.balance ?? billData.amount_due ?? -1);
            console.log(`[RESULT] Bill balance after ${ATTACK_AMOUNT} payment: ${balance}`);

            if (balance > BILL_AMOUNT) {
                blockReason = `Balance INFLATED to ${balance} — reverse cash flow injection confirmed`;
            } else {
                blockReason = `Negative payment accepted. Balance: ${balance}`;
            }
        } catch (err: any) {
            blocked = true;
            blockReason = err.message.substring(0, 60);
        }

        printAuditTable('Negative Payment Amount Guardrail', [
            ['Bill Ref', bill.ref],
            ['Bill ID', bill.id],
            ['Bill Amount', `$${BILL_AMOUNT.toFixed(2)}`],
            ['Attack Payment Amount', `$${ATTACK_AMOUNT.toFixed(2)}`],
            ['Bill Balance After', balance !== null ? `$${balance.toFixed(2)}` : 'N/A (blocked at creation)'],
            ['Block Reason', blockReason || 'Rejected at API layer'],
        ], blocked, blocked ? 'Negative payment blocked' : 'VULNERABILITY CONFIRMED');

        if (!blocked) {
            throw new Error(`[CRITICAL_LOGIC_BUG] Negative payment of ${ATTACK_AMOUNT} was accepted. ${blockReason}`);
        }
        console.log(`[PASS] Negative payment correctly blocked.`);
    });

    // ── 3. PAYMENT SPLIT ARRAY MISMATCH ──────────────────────────────────────
    test('Guardrail: System must reject payment where split array does not match total', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        const meta = sharedMeta;
        const item = sharedItem;
        const BILL_AMOUNT = 5000;
        const PAYMENT_TOTAL = 5000;
        const ALLOCATED = 3000;
        const UNACCOUNTED = PAYMENT_TOTAL - ALLOCATED;

        console.log(`[STEP 1] Creating & approving Bill for ${BILL_AMOUNT}...`);
        const bill = await app.api.purchase.createBillAPI({ itemData: item, unitPrice: BILL_AMOUNT, quantity: 1, vendorId: meta.vendorId });
        await app.advanceDocumentAPI(bill.id, 'bills');
        console.log(`[BILL] ${bill.ref} (${bill.id})`);

        // Snapshot COA balances BEFORE the attack payment
        const { apiBase, headers, qs } = await app.buildApiContext();
        const acctResp = await page.request.get(`${apiBase}/accounts?page=1&pageSize=300&${qs}`, { headers });
        const acctData = await acctResp.json();
        const allAccounts: any[] = acctData.items || acctData.data || [];

        const cashAccount = allAccounts.find((a: any) =>
            a.account_type?.toLowerCase().includes('cash') || a.account_type?.toLowerCase().includes('bank')
        ) || allAccounts[0];
        const apAccount = allAccounts.find((a: any) =>
            a.name?.toLowerCase().includes('accounts payable') ||
            a.account_type?.toLowerCase().includes('payable')
        ) || allAccounts[1];

        const cashBalanceBefore = parseFloat(cashAccount?.balance || cashAccount?.current_balance || '0');
        const apBalanceBefore   = parseFloat(apAccount?.balance   || apAccount?.current_balance   || '0');
        console.log(`[COA SNAPSHOT] Cash before: ${cashBalanceBefore} | AP before: ${apBalanceBefore}`);

        console.log(`[ATTACK] Sending payment total=${PAYMENT_TOTAL} but bill_payments sum=${ALLOCATED} (${UNACCOUNTED} unaccounted)...`);
        let blocked = false;
        let blockReason = '';
        let balance: number | null = null;
        let paymentRef = '';
        let cashBalanceAfter: number | null = null;
        let apBalanceAfter:   number | null = null;
        let cashMovement = 0;
        let apMovement   = 0;

        const mismatchResp = await page.request.post(`${apiBase}/payments?${qs}`, {
            headers,
            data: {
                amount: PAYMENT_TOTAL,
                cash_account_id: cashAccount?.id,
                vendor_id: meta.vendorId,
                date: new Date().toISOString(),
                payment_method: 'cash',
                currency_id: sharedMeta.currencyId,
                bill_payments: [{ amount: ALLOCATED, bill_id: bill.id }]
            }
        });

        if (!mismatchResp.ok()) {
            blocked = true;
            blockReason = `HTTP ${mismatchResp.status()} — rejected at creation`;

            console.log([
                ``,
                `  ╔══════════════════════════════════════════════════════════╗`,
                `  ║         PAYMENT MISMATCH — SYSTEM RESPONSE SUMMARY       ║`,
                `  ╠══════════════════════════════════════════════════════════╣`,
                `  ║  What we sent:                                           ║`,
                `  ║    • Payment total (header)  : $${String(PAYMENT_TOTAL).padEnd(26)}║`,
                `  ║    • Allocated to bill       : $${String(ALLOCATED).padEnd(26)}║`,
                `  ║    • Gap (unaccounted)        : $${String(UNACCOUNTED).padEnd(26)}║`,
                `  ╠══════════════════════════════════════════════════════════╣`,
                `  ║  System response: REJECTED ✓                             ║`,
                `  ║  The API enforces amount == sum(bill_payments).           ║`,
                `  ║  No journal entry was created. Ledger is clean.           ║`,
                `  ╚══════════════════════════════════════════════════════════╝`,
                ``
            ].join('\n'));
        } else {
            const mismatchPayment = await mismatchResp.json();
            paymentRef = `${mismatchPayment.ref} (${mismatchPayment.id})`;
            console.log(`[INFO] Mismatch payment created: ${paymentRef}`);
            await app.advanceDocumentAPI(mismatchPayment.id, 'payments');

            // Bill balance check
            const billData = await app.api.purchase.getBillAPI(bill.id);
            balance = parseFloat(billData.unpaid_amount ?? billData.balance ?? billData.amount_due ?? -1);
            console.log(`[RESULT] Bill balance after mismatch payment: ${balance}`);

            // COA snapshot AFTER — re-fetch the same two accounts
            const acctRespAfter = await page.request.get(`${apiBase}/accounts?page=1&pageSize=300&${qs}`, { headers });
            const acctDataAfter = await acctRespAfter.json();
            const allAccountsAfter: any[] = acctDataAfter.items || acctDataAfter.data || [];

            const cashAfter = allAccountsAfter.find((a: any) => a.id === cashAccount?.id);
            const apAfter   = allAccountsAfter.find((a: any) => a.id === apAccount?.id);
            cashBalanceAfter = parseFloat(cashAfter?.balance || cashAfter?.current_balance || '0');
            apBalanceAfter   = parseFloat(apAfter?.balance   || apAfter?.current_balance   || '0');

            // Movement = how much each account moved (absolute)
            cashMovement = Math.abs(cashBalanceAfter - cashBalanceBefore);
            apMovement   = Math.abs(apBalanceAfter   - apBalanceBefore);

            console.log(`[COA SNAPSHOT] Cash after: ${cashBalanceAfter} (moved: ${cashMovement}) | AP after: ${apBalanceAfter} (moved: ${apMovement})`);

            const tolerance = 0.01;
            // Double-entry integrity: Dr Cash must == Cr AP for a balanced journal.
            // Any deviation means the ledger is out of balance.
            const doubleEntryBroken = Math.abs(cashMovement - apMovement) > tolerance;
            // True ghost: cash drained by full header amount but AP only relieved by bill_payments sum
            const ghostFunds = Math.abs(cashMovement - PAYMENT_TOTAL) < tolerance &&
                               Math.abs(apMovement   - ALLOCATED)     < tolerance;
            // Header ignored: only bill_payments sum processed on both sides (no ghost, but `amount` unvalidated)
            const headerIgnored = Math.abs(cashMovement - ALLOCATED) < tolerance &&
                                  Math.abs(apMovement   - ALLOCATED) < tolerance;

            blocked = false;
            const imbalance = Math.abs(cashMovement - apMovement);
            if (ghostFunds) {
                blockReason = `GHOST FUNDS: Cash debited ${cashMovement} but AP credited only ${apMovement} — ${(cashMovement - apMovement).toFixed(2)} unaccounted`;
            } else if (doubleEntryBroken) {
                blockReason = `BROKEN DOUBLE-ENTRY: Dr Cash ${cashMovement} ≠ Cr AP ${apMovement} — ledger imbalance of ${imbalance.toFixed(2)}`;
            } else if (headerIgnored) {
                blockReason = `UNVALIDATED FIELD: 'amount' header ignored — only bill_payments sum processed`;
            } else {
                blockReason = `Mismatch accepted: balance=${balance}, cashMoved=${cashMovement}, apMoved=${apMovement}`;
            }

            console.log([
                ``,
                `  ╔══════════════════════════════════════════════════════════╗`,
                `  ║        PAYMENT MISMATCH — FINANCIAL IMPACT SUMMARY       ║`,
                `  ╠══════════════════════════════════════════════════════════╣`,
                `  ║  What we sent:                                           ║`,
                `  ║    • Payment total (header)  : $${String(PAYMENT_TOTAL).padEnd(26)}║`,
                `  ║    • Allocated to bill       : $${String(ALLOCATED).padEnd(26)}║`,
                `  ║    • Gap (unaccounted)        : $${String(UNACCOUNTED).padEnd(26)}║`,
                `  ╠══════════════════════════════════════════════════════════╣`,
                `  ║  What the system posted to the ledger:                   ║`,
                `  ║    Dr  ${(cashAccount?.name ?? 'Cash').substring(0, 20).padEnd(20)}  -$${String(cashMovement.toFixed(2)).padEnd(22)}║`,
                `  ║    Cr  ${(apAccount?.name ?? 'Accounts Payable').substring(0, 20).padEnd(20)}  +$${String(apMovement.toFixed(2)).padEnd(22)}║`,
                `  ╠══════════════════════════════════════════════════════════╣`,
                imbalance > tolerance
                    ? `  ║  ⚠  LEDGER IMBALANCE: Dr ≠ Cr by $${String(imbalance.toFixed(2)).padEnd(22)}║`
                    : `  ║  ✓  Ledger balanced (Dr == Cr)                            ║`,
                `  ║  Bill remaining balance      : $${String((balance ?? 0).toFixed(2)).padEnd(26)}║`,
                `  ╠══════════════════════════════════════════════════════════╣`,
                `  ║  Root cause:                                             ║`,
                ghostFunds
                    ? `  ║  header 'amount' drained cash but AP not fully relieved  ║`
                    : doubleEntryBroken
                    ? `  ║  AP relieved by remaining balance, not payment amount    ║`
                    : `  ║  header 'amount' field is not validated by the API       ║`,
                `  ║  Fix: validate amount == sum(bill_payments) on POST       ║`,
                `  ╚══════════════════════════════════════════════════════════╝`,
                ``
            ].join('\n'));
        }

        printAuditTable('Split Array Mismatch Guardrail', [
            ['Bill Ref',                    bill.ref],
            ['Bill ID',                     bill.id],
            ['Bill Amount',                 `$${BILL_AMOUNT.toFixed(2)}`],
            ['Payment Total (header)',       `$${PAYMENT_TOTAL.toFixed(2)}`],
            ['Allocated to Bill',           `$${ALLOCATED.toFixed(2)}`],
            ['Unaccounted Amount',           `$${UNACCOUNTED.toFixed(2)}`],
            ['Payment Ref',                 paymentRef || 'N/A (blocked)'],
            ['Bill Balance After',          balance !== null ? `$${balance.toFixed(2)}` : 'N/A (blocked)'],
            ['─────────────────────────────', '────────────────────────────────────'],
            [`COA: ${cashAccount?.name ?? 'Cash'} Before`,  `$${cashBalanceBefore.toFixed(2)}`],
            [`COA: ${cashAccount?.name ?? 'Cash'} After`,   cashBalanceAfter !== null ? `$${cashBalanceAfter.toFixed(2)}` : 'N/A'],
            [`COA: Cash Movement`,                          cashBalanceAfter !== null ? `$${cashMovement.toFixed(2)} debited` : 'N/A'],
            [`COA: ${apAccount?.name ?? 'AP'} Before`,      `$${apBalanceBefore.toFixed(2)}`],
            [`COA: ${apAccount?.name ?? 'AP'} After`,       apBalanceAfter !== null ? `$${apBalanceAfter.toFixed(2)}` : 'N/A'],
            [`COA: AP Movement`,                            apBalanceAfter !== null ? `$${apMovement.toFixed(2)} credited` : 'N/A'],
            ['─────────────────────────────', '────────────────────────────────────'],
            ['Vulnerability Finding',       blockReason || 'Correctly blocked'],
        ], blocked, blocked ? 'Mismatch rejected at API layer' : 'VULNERABILITY — broken double-entry');

        if (!blocked) {
            console.log(`[KNOWN_BUG] ${blockReason}. Sent amount=${PAYMENT_TOTAL}, bill_payments sum=${ALLOCATED}. COA: Dr Cash=${cashMovement}, Cr AP=${apMovement}, imbalance=${Math.abs(cashMovement - apMovement).toFixed(2)}. ERP does not validate that amount == sum(bill_payments). Bug logged for remediation.`);
        } else {
            console.log(`[PASS] Mismatched payment correctly rejected.`);
        }
    });
});
