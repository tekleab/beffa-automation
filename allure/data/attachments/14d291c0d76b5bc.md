# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-module/line-item-miscellaneous-audit.spec.ts >> Line Item & Miscellaneous Audit @sales @purchase @regression >> PAY-API-02: Multi-bill payment → all bills settle to zero
- Location: tests/cross-module/line-item-miscellaneous-audit.spec.ts:1601:9

# Error details

```
Error: expect(received).toBeLessThan(expected)

Expected: < 1
Received:   60
```

# Test source

```ts
  1551 |         const app = new AppManager(page);
  1552 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  1553 |         const TOTAL = 5000;
  1554 | 
  1555 |         const bill = await app.api.purchase.createBillAPI({
  1556 |             itemData: itemA, quantity: 2, unitPrice: TOTAL / 2,
  1557 |             vendorId: purchaseMeta.vendorId, apAccountId: purchaseMeta.apAccountId,
  1558 |         });
  1559 |         await app.advanceDocumentAPI(bill.id, 'bills');
  1560 | 
  1561 |         let payment: any;
  1562 |         try {
  1563 |             payment = await app.api.purchase.createBillPaymentAPI({
  1564 |                 amount: TOTAL, billId: bill.id, vendorId: purchaseMeta.vendorId,
  1565 |             });
  1566 |         } catch (e: any) {
  1567 |             if (e.message.includes('500') && e.message.includes('Unable to create Payment')) {
  1568 |                 console.log(`[BACKEND_DEFECT] Single bill payment failed with known 500 "Unable to create Payment" on approved bill.`);
  1569 |                 return;
  1570 |             }
  1571 |             throw e;
  1572 |         }
  1573 |         await app.advanceDocumentAPI(payment.id, 'payments');
  1574 | 
  1575 |         // Wait for ERP to process the payment and update bill balance
  1576 |         await page.waitForTimeout(5000);
  1577 |         const billData = await app.api.purchase.getBillAPI(bill.id);
  1578 | 
  1579 |         // Derive remaining balance: prefer unpaid_amount, then compute from paid_amount, then status
  1580 |         const rawUnpaid = billData.unpaid_amount;
  1581 |         const rawPaid   = billData.paid_amount ?? billData.total_paid;
  1582 |         const rawTotal  = parseFloat(billData.net_due ?? billData.amount ?? billData.total_amount ?? String(TOTAL));
  1583 |         let remaining: number;
  1584 | 
  1585 |         if (rawUnpaid !== undefined && rawUnpaid !== null) {
  1586 |             remaining = parseFloat(String(rawUnpaid));
  1587 |         } else if (rawPaid !== undefined && rawPaid !== null) {
  1588 |             remaining = Math.max(0, rawTotal - parseFloat(String(rawPaid)));
  1589 |         } else if (['paid', 'fully_paid', 'closed'].includes(String(billData.status).toLowerCase())) {
  1590 |             remaining = 0;
  1591 |         } else {
  1592 |             remaining = rawTotal; // conservatively: not yet updated
  1593 |         }
  1594 | 
  1595 |         console.log(`[AUDIT] Bill $${TOTAL} | Paid $${rawPaid ?? 'n/a'} | Remaining: $${remaining} | Status: ${billData.status} | unpaid_amount: ${rawUnpaid}`);
  1596 |         expect(remaining).toBeLessThan(1);
  1597 |         console.log('[PASS] Full payment settles bill to zero');
  1598 |     });
  1599 | 
  1600 | 
  1601 |     test('PAY-API-02: Multi-bill payment → all bills settle to zero', async ({ page }) => {
  1602 |         const app = new AppManager(page);
  1603 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  1604 |         const AMT_A = 3000, AMT_B = 2000;
  1605 | 
  1606 |         const [billA, billB] = await Promise.all([
  1607 |             app.api.purchase.createBillAPI({ itemData: itemA, quantity: 3, unitPrice: AMT_A / 3, vendorId: purchaseMeta.vendorId }),
  1608 |             app.api.purchase.createBillAPI({ itemData: itemB, quantity: 2, unitPrice: AMT_B / 2, vendorId: purchaseMeta.vendorId }),
  1609 |         ]);
  1610 |         await Promise.all([
  1611 |             app.advanceDocumentAPI(billA.id, 'bills'),
  1612 |             app.advanceDocumentAPI(billB.id, 'bills'),
  1613 |         ]);
  1614 | 
  1615 |         let payment: any;
  1616 |         try {
  1617 |             payment = await app.api.purchase.createMultiBillPaymentAPI({
  1618 |                 amount: AMT_A + AMT_B,
  1619 |                 vendorId: purchaseMeta.vendorId,
  1620 |                 billPayments: [{ amount: AMT_A, bill_id: billA.id }, { amount: AMT_B, bill_id: billB.id }],
  1621 |             });
  1622 |         } catch (e: any) {
  1623 |             if (e.message.includes('500') && e.message.includes('Unable to create Payment')) {
  1624 |                 console.log(`[BACKEND_DEFECT] Multi-bill payment failed with known 500 "Unable to create Payment" on approved bills.`);
  1625 |                 return;
  1626 |             }
  1627 |             throw e;
  1628 |         }
  1629 |         await app.advanceDocumentAPI(payment.id, 'payments');
  1630 | 
  1631 |         await page.waitForTimeout(5000);
  1632 |         const [dataA, dataB] = await Promise.all([
  1633 |             app.api.purchase.getBillAPI(billA.id),
  1634 |             app.api.purchase.getBillAPI(billB.id),
  1635 |         ]);
  1636 | 
  1637 |         const deriveRemaining = (d: any, amt: number) => {
  1638 |             const rawUnpaid = d.unpaid_amount;
  1639 |             const rawPaid = d.paid_amount ?? d.total_paid;
  1640 |             const rawTotal = parseFloat(d.net_due ?? d.amount ?? d.total_amount ?? String(amt));
  1641 |             if (rawUnpaid !== undefined && rawUnpaid !== null) return parseFloat(String(rawUnpaid));
  1642 |             if (rawPaid !== undefined && rawPaid !== null) return Math.max(0, rawTotal - parseFloat(String(rawPaid)));
  1643 |             if (['paid', 'fully_paid', 'closed'].includes(String(d.status).toLowerCase())) return 0;
  1644 |             return rawTotal;
  1645 |         };
  1646 | 
  1647 |         const remA = deriveRemaining(dataA, AMT_A);
  1648 |         const remB = deriveRemaining(dataB, AMT_B);
  1649 |         console.log(`[AUDIT] Bill A remaining: $${remA} (status=${dataA.status}, unpaid=${dataA.unpaid_amount}, paid=${dataA.paid_amount})`);
  1650 |         console.log(`[AUDIT] Bill B remaining: $${remB} (status=${dataB.status}, unpaid=${dataB.unpaid_amount}, paid=${dataB.paid_amount})`);
> 1651 |         expect(remA).toBeLessThan(1);
       |                      ^ Error: expect(received).toBeLessThan(expected)
  1652 |         expect(remB).toBeLessThan(1);
  1653 |         console.log('[PASS] Multi-bill payment settles all bills to zero');
  1654 |     });
  1655 | 
  1656 | 
  1657 |     test('PAY-API-03: Partial payment → bill balance reduces by exact amount', async ({ page }) => {
  1658 |         const app = new AppManager(page);
  1659 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  1660 |         const TOTAL = 6000, PARTIAL = 2000;
  1661 | 
  1662 |         // Use a fresh isolated item to avoid location/stock depletion from earlier tests
  1663 |         const freshItem = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'FIFO', quantity: 50, unit_cost: 100 });
  1664 | 
  1665 |         const bill = await app.api.purchase.createBillAPI({
  1666 |             itemData: freshItem, quantity: 2, unitPrice: TOTAL / 2,
  1667 |             vendorId: purchaseMeta.vendorId, apAccountId: purchaseMeta.apAccountId,
  1668 |         });
  1669 |         await app.advanceDocumentAPI(bill.id, 'bills');
  1670 | 
  1671 |         let payment: { id: string } | null = null;
  1672 |         try {
  1673 |             payment = await app.api.purchase.createBillPaymentAPI({
  1674 |                 amount: PARTIAL, billId: bill.id, vendorId: purchaseMeta.vendorId,
  1675 |             });
  1676 |         } catch (e: any) {
  1677 |             throw new Error(`BUG: ERP returns 500 "Unable to create Payment" on approved bill partial payment. Invoice: ${bill.id}. Error: ${e.message}`);
  1678 |         }
  1679 |         await app.advanceDocumentAPI(payment.id, 'payments');
  1680 | 
  1681 |         await page.waitForTimeout(3000);
  1682 |         const billData = await app.api.purchase.getBillAPI(bill.id);
  1683 |         const remaining = parseFloat(billData.unpaid_amount ?? billData.balance ?? billData.net_due ?? '999');
  1684 |         console.log(`[AUDIT] Bill $${TOTAL} | Paid $${PARTIAL} | Remaining $${remaining} | Expected $${TOTAL - PARTIAL}`);
  1685 |         expect(remaining).toBeCloseTo(TOTAL - PARTIAL, 1);
  1686 |         console.log('[PASS] Partial payment reduces bill balance correctly');
  1687 |     });
  1688 | });
  1689 | 
```