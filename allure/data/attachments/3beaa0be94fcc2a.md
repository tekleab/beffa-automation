# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-module/line-item-miscellaneous-audit.spec.ts >> Line Item & Miscellaneous Audit @sales @purchase @regression >> PAY-API-03: Partial payment → bill balance reduces by exact amount
- Location: tests/cross-module/line-item-miscellaneous-audit.spec.ts:1624:9

# Error details

```
Error: BUG: ERP returns 500 "Unable to create Payment" on approved bill partial payment. Invoice: 4c816bdc-b425-4976-be01-1336ecda18c8. Error: Bill-Payment API failed: 500 - {
	"code": 500,
	"message": "Unable to create Payment"
}

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e11]:
      - heading "Welcome to, befa" [level=3] [ref=e12]
      - paragraph [ref=e13]: Empower Your Finances, Simplify Your Success
      - paragraph [ref=e14]: From meticulous bookkeeping to seamless inventory control, we've got your back.
    - generic [ref=e16]:
      - heading "Login To Your Account" [level=2] [ref=e17]
      - generic [ref=e18]:
        - text: Not a member?
        - link "Register" [ref=e19] [cursor=pointer]:
          - /url: /users/register
      - generic [ref=e21]:
        - group [ref=e22]:
          - generic [ref=e23]: Email *
          - textbox "Email *" [ref=e25]:
            - /placeholder: Enter your email
        - group [ref=e26]:
          - generic [ref=e27]: Password *
          - generic [ref=e28]:
            - textbox "Password *" [ref=e29]:
              - /placeholder: Enter your password
            - button "Show password" [ref=e31] [cursor=pointer]
        - link "Forget Password?" [ref=e37] [cursor=pointer]:
          - /url: forget-password
        - button "Login" [ref=e39] [cursor=pointer]
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right"
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right"
```

# Test source

```ts
  1544 |         await app.advanceDocumentAPI(bill.id, 'bills');
  1545 | 
  1546 |         const payment = await app.api.purchase.createBillPaymentAPI({
  1547 |             amount: TOTAL, billId: bill.id, vendorId: purchaseMeta.vendorId,
  1548 |         });
  1549 |         await app.advanceDocumentAPI(payment.id, 'payments');
  1550 | 
  1551 |         // Wait for ERP to process the payment and update bill balance
  1552 |         await page.waitForTimeout(5000);
  1553 |         const billData = await app.api.purchase.getBillAPI(bill.id);
  1554 | 
  1555 |         // Derive remaining balance: prefer unpaid_amount, then compute from paid_amount, then status
  1556 |         const rawUnpaid = billData.unpaid_amount;
  1557 |         const rawPaid   = billData.paid_amount ?? billData.total_paid;
  1558 |         const rawTotal  = parseFloat(billData.net_due ?? billData.amount ?? billData.total_amount ?? String(TOTAL));
  1559 |         let remaining: number;
  1560 | 
  1561 |         if (rawUnpaid !== undefined && rawUnpaid !== null) {
  1562 |             remaining = parseFloat(String(rawUnpaid));
  1563 |         } else if (rawPaid !== undefined && rawPaid !== null) {
  1564 |             remaining = Math.max(0, rawTotal - parseFloat(String(rawPaid)));
  1565 |         } else if (['paid', 'fully_paid', 'closed'].includes(String(billData.status).toLowerCase())) {
  1566 |             remaining = 0;
  1567 |         } else {
  1568 |             remaining = rawTotal; // conservatively: not yet updated
  1569 |         }
  1570 | 
  1571 |         console.log(`[AUDIT] Bill $${TOTAL} | Paid $${rawPaid ?? 'n/a'} | Remaining: $${remaining} | Status: ${billData.status} | unpaid_amount: ${rawUnpaid}`);
  1572 |         expect(remaining).toBeLessThan(1);
  1573 |         console.log('[PASS] Full payment settles bill to zero');
  1574 |     });
  1575 | 
  1576 | 
  1577 |     test('PAY-API-02: Multi-bill payment → all bills settle to zero', async ({ page }) => {
  1578 |         const app = new AppManager(page);
  1579 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  1580 |         const AMT_A = 3000, AMT_B = 2000;
  1581 | 
  1582 |         const [billA, billB] = await Promise.all([
  1583 |             app.api.purchase.createBillAPI({ itemData: itemA, quantity: 3, unitPrice: AMT_A / 3, vendorId: purchaseMeta.vendorId }),
  1584 |             app.api.purchase.createBillAPI({ itemData: itemB, quantity: 2, unitPrice: AMT_B / 2, vendorId: purchaseMeta.vendorId }),
  1585 |         ]);
  1586 |         await Promise.all([
  1587 |             app.advanceDocumentAPI(billA.id, 'bills'),
  1588 |             app.advanceDocumentAPI(billB.id, 'bills'),
  1589 |         ]);
  1590 | 
  1591 |         const payment = await app.api.purchase.createMultiBillPaymentAPI({
  1592 |             amount: AMT_A + AMT_B,
  1593 |             vendorId: purchaseMeta.vendorId,
  1594 |             billPayments: [{ amount: AMT_A, bill_id: billA.id }, { amount: AMT_B, bill_id: billB.id }],
  1595 |         });
  1596 |         await app.advanceDocumentAPI(payment.id, 'payments');
  1597 | 
  1598 |         await page.waitForTimeout(5000);
  1599 |         const [dataA, dataB] = await Promise.all([
  1600 |             app.api.purchase.getBillAPI(billA.id),
  1601 |             app.api.purchase.getBillAPI(billB.id),
  1602 |         ]);
  1603 | 
  1604 |         const deriveRemaining = (d: any, amt: number) => {
  1605 |             const rawUnpaid = d.unpaid_amount;
  1606 |             const rawPaid = d.paid_amount ?? d.total_paid;
  1607 |             const rawTotal = parseFloat(d.net_due ?? d.amount ?? d.total_amount ?? String(amt));
  1608 |             if (rawUnpaid !== undefined && rawUnpaid !== null) return parseFloat(String(rawUnpaid));
  1609 |             if (rawPaid !== undefined && rawPaid !== null) return Math.max(0, rawTotal - parseFloat(String(rawPaid)));
  1610 |             if (['paid', 'fully_paid', 'closed'].includes(String(d.status).toLowerCase())) return 0;
  1611 |             return rawTotal;
  1612 |         };
  1613 | 
  1614 |         const remA = deriveRemaining(dataA, AMT_A);
  1615 |         const remB = deriveRemaining(dataB, AMT_B);
  1616 |         console.log(`[AUDIT] Bill A remaining: $${remA} (status=${dataA.status}, unpaid=${dataA.unpaid_amount}, paid=${dataA.paid_amount})`);
  1617 |         console.log(`[AUDIT] Bill B remaining: $${remB} (status=${dataB.status}, unpaid=${dataB.unpaid_amount}, paid=${dataB.paid_amount})`);
  1618 |         expect(remA).toBeLessThan(1);
  1619 |         expect(remB).toBeLessThan(1);
  1620 |         console.log('[PASS] Multi-bill payment settles all bills to zero');
  1621 |     });
  1622 | 
  1623 | 
  1624 |     test('PAY-API-03: Partial payment → bill balance reduces by exact amount', async ({ page }) => {
  1625 |         const app = new AppManager(page);
  1626 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  1627 |         const TOTAL = 6000, PARTIAL = 2000;
  1628 | 
  1629 |         // Use a fresh isolated item to avoid location/stock depletion from earlier tests
  1630 |         const freshItem = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'FIFO', quantity: 50, unit_cost: 100 });
  1631 | 
  1632 |         const bill = await app.api.purchase.createBillAPI({
  1633 |             itemData: freshItem, quantity: 2, unitPrice: TOTAL / 2,
  1634 |             vendorId: purchaseMeta.vendorId, apAccountId: purchaseMeta.apAccountId,
  1635 |         });
  1636 |         await app.advanceDocumentAPI(bill.id, 'bills');
  1637 | 
  1638 |         let payment: { id: string } | null = null;
  1639 |         try {
  1640 |             payment = await app.api.purchase.createBillPaymentAPI({
  1641 |                 amount: PARTIAL, billId: bill.id, vendorId: purchaseMeta.vendorId,
  1642 |             });
  1643 |         } catch (e: any) {
> 1644 |             throw new Error(`BUG: ERP returns 500 "Unable to create Payment" on approved bill partial payment. Invoice: ${bill.id}. Error: ${e.message}`);
       |                   ^ Error: BUG: ERP returns 500 "Unable to create Payment" on approved bill partial payment. Invoice: 4c816bdc-b425-4976-be01-1336ecda18c8. Error: Bill-Payment API failed: 500 - {
  1645 |         }
  1646 |         await app.advanceDocumentAPI(payment.id, 'payments');
  1647 | 
  1648 |         await page.waitForTimeout(3000);
  1649 |         const billData = await app.api.purchase.getBillAPI(bill.id);
  1650 |         const remaining = parseFloat(billData.unpaid_amount ?? billData.balance ?? billData.net_due ?? '999');
  1651 |         console.log(`[AUDIT] Bill $${TOTAL} | Paid $${PARTIAL} | Remaining $${remaining} | Expected $${TOTAL - PARTIAL}`);
  1652 |         expect(remaining).toBeCloseTo(TOTAL - PARTIAL, 1);
  1653 |         console.log('[PASS] Partial payment reduces bill balance correctly');
  1654 |     });
  1655 | });
  1656 | 
```