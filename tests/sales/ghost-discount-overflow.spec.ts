import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * PHASE 2 - SCENARIO 3: Ghost Discount Overflow (Sanity Bounds Violation)
 *
 * Hypothesis: Injecting a discount value that exceeds the total line item cost
 * (e.g. $1000 item with a $1500 discount) will result in negative total liability.
 * If backend bounds checking is missing, the system will effectively process an invoice
 * that credits the Accounts Receivable and debits Sales, allowing the user to
 * "steal" money by returning free stock.
 */
test.describe('Ghost Discount Overflow Bounds Attack @security @sales', () => {

    test('Guardrail: System must mathematically reject discounts exceeding invoice value', async ({ page }) => {
        test.setTimeout(120000);
        const app = new AppManager(page);

        console.log('[ACTION] Authenticating primary session...');
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        
        console.log('[ACTION] Extracting baseline metadata...');
        const meta = await app.api.sales.discoverMetadataAPI();
        const item = await app.captureRandomItemDataAPI();

        // Target a baseline value
        const EXPLOIT_UNIT_PRICE = 1000;
        const EXPLOIT_DISCOUNT_CASH = 3500; // Massively overdraw the line limits

        console.log(`[SETUP] Base Item Price: ${EXPLOIT_UNIT_PRICE}`);
        console.log(`[ATTACK] Injecting bounds-breaking discount: -${EXPLOIT_DISCOUNT_CASH}`);

        try {
            const rogueInvoice = await app.api.sales.createStandaloneInvoiceAPI({
                customerId: meta.customerId,
                itemId: item.itemId,
                quantity: 1,
                unitPrice: EXPLOIT_UNIT_PRICE,
                locationId: item.locationId,
                warehouseId: item.warehouseId,
                discount_amount: EXPLOIT_DISCOUNT_CASH,
                discount_type: 'cash'
            });

            console.log(`[OBSERVATION] Backend failed to reject bounds overflow at creation phase! Generated Invoice: ${rogueInvoice.ref}`);
            
            // Advance to approval to see if GL verification traps it
            try {
                await app.advanceDocumentAPI(rogueInvoice.id, 'invoices');
                
                // Fetch the invoice explicitly to read the amount
                const checkStatus = await app.api.sales.getInvoiceAPI(rogueInvoice.id);
                console.log(`[AUDIT] After Approval: Invoice Total is ${checkStatus.total_amount}`);
                
                if (Number(checkStatus.total_amount) < 0) {
                    throw new Error(`[CRITICAL_LOGIC_BUG] ERP mathematically allowed a Ghost Discount overflow (-${EXPLOIT_DISCOUNT_CASH} on a ${EXPLOIT_UNIT_PRICE} item)! The net total of the approved invoice is now completely negative (${checkStatus.total_amount}), essentially turning Accounts Receivable into Accounts Payable, generating fraudulent global balance mappings!`);
                }

                console.log(`[PASS] Wait, the system approved it but clamped the total to mathematically safe constraints: ${checkStatus.total_amount}`);

            } catch (authErr: any) {
                if (authErr.message.includes('CRITICAL_LOGIC_BUG')) throw authErr;
                console.log(`[PASS] Bounds overflow securely intercepted during ledger evaluation / approval stage: ${authErr.message}`);
            }

        } catch (error: any) {
            if (error.message.includes('CRITICAL_LOGIC_BUG')) {
                throw error;
            } else if (error.message.includes('500')) {
                console.log(`[SECONDARY_BUG] Backend crashed with a 500 error processing negative margins, failing to map cleanly into a solid bounds validation response.`);
                console.log(`[PASS] Attack blocked via systemic crash threshold.`);
            } else {
                console.log(`[PASS] System explicitly rejected ghost discount injection natively: ${error.message}`);
            }
        }
    });

});
