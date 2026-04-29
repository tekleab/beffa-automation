# BEFFA ERP: Manual Test Specification (Financial Module)
**Project:** BEFFA Automation Audit  
**Scope:** Sales, Purchase, Inventory & Security Boundaries  
**Total Scenarios:** ~100 Manual Cases mapped from 33 Automated Scripts

## 1. Sales & Accounts Receivable (AR) Workflows

### SC-01: Sales Order to Invoice Lifecycle
| ID | Scenario | Verification | Impact |
| :--- | :--- | :--- | :--- |
| 1.1 | Standard Sales Cycle | Create SO -> Approve -> Convert to Invoice -> Approve. | High |
| 1.2 | [Security] Over-Invoicing | Try to invoice 10 units for an SO that only has 5 approved. | **CRITICAL** |
| 1.3 | [Security] Price Injection | Intercept SO-to-Invoice conversion and manually lower the price. | **CRITICAL** |
| 1.4 | Partial Conversion | Convert only 2 units of a 10-unit SO; verify "Remaining" balance. | Medium |

### SC-02: Receipts & Settlement
| ID | Scenario | Verification | Impact |
| :--- | :--- | :--- | :--- |
| 2.1 | Single Receipt Linking | Link a Cash Receipt to an Approved Invoice. | High |
| 2.2 | Multi-Link Settlement | Link one large receipt to three different invoices. | Medium |
| 2.3 | [Security] Double-Dip | Attempt to pay the same Invoice twice using back-to-back requests. | **CRITICAL** |
| 2.4 | Receipt Reversal | Void a receipt and verify the Invoice "Amount Due" restores instantly. | High |

---

## 2. Purchase & Accounts Payable (AP) Workflows

### PC-01: Purchase Order to Bill Lifecycle
| ID | Scenario | Verification | Impact |
| :--- | :--- | :--- | :--- |
| 1.1 | Standard Purchase Cycle | Create PO -> Approve -> Receive Items -> Create Bill -> Approve. | High |
| 1.2 | Duplicate Bill Check | Attempt to create two bills with the same "Vendor Invoice Number". | Medium |
| 1.3 | PO Balance Guardrail | Verify you cannot create a Bill for more items than the PO received. | High |

### PC-02: Bill Payments
| ID | Scenario | Verification | Impact |
| :--- | :--- | :--- | :--- |
| 2.1 | Bill Settlement | Pay an approved Bill via Bank/Cash account. | High |
| 2.2 | [Security] Over-Payment | Try to pay $1500 for a $1000 Bill. | High |
| 2.3 | Ledger Verification | Verify "Accounts Payable" account decreases after Bill Payment. | Medium |

---

## 3. Inventory & Warehouse Integrity

### IN-01: Stock Deduction & Restoration
| ID | Scenario | Verification | Impact |
| :--- | :--- | :--- | :--- |
| 1.1 | Invoice Stock Out | Approve an Invoice; check Warehouse Bin for item reduction. | High |
| 1.2 | Bill Stock In | Approve a Bill; check Warehouse Bin for item increase. | High |
| 1.3 | Reversal Restoration | Void an Invoice; verify stock immediately returns to inventory. | High |
| 1.4 | [Security] Negative Stock | Sell an item with 0 stock; verify system blocks document approval. | **CRITICAL** |

### IN-02: Inventory Adjustments
| ID | Scenario | Verification | Impact |
| :--- | :--- | :--- | :--- |
| 2.1 | Manual Write-Down | Create adjustment to reduce stock due to damage; verify GL impact. | Medium |
| 2.2 | Manual Write-Up | Create adjustment to increase stock; verify Cost of Goods Sold. | Medium |

---

## 4. Security & Boundary Guardrails

### SG-01: Mathematical Integrity
| ID | Scenario | Verification | Impact |
| :--- | :--- | :--- | :--- |
| 1.1 | Zero Amount Receipt | Attempt to save a receipt with $0.00 value. | High |
| 1.2 | Negative Price Attack | Enter a -500.00 price in an invoice line item. | **CRITICAL** |
| 1.3 | Discount Overflow | Apply a $5000 discount to a $1000 item. | High |

### SG-02: Temporal & Logical Isolation
| ID | Scenario | Verification | Impact |
| :--- | :--- | :--- | :--- |
| 2.1 | Back-Dating Attack | Set Invoice Date to "2021-01-01" in a live 2024 system. | **CRITICAL** |
| 2.2 | Void-Side Loading | Attempt to pay an invoice while it is being voided by another user. | High |
| 2.3 | Cross-Customer IDOR | Manipulate document UUID in URL to view another company's data. | **CRITICAL** |

---

## 5. Concurrency (Stress Testing)

### CT-01: Simultaneous Race Conditions
| ID | Scenario | Verification | Impact |
| :--- | :--- | :--- | :--- |
| 1.1 | Multi-User Approval | Two managers click "Approve" on the same SO at once. | Medium |
| 1.2 | Concurrent Stock Out | Two sales reps sell the last 1 item in the system. | **CRITICAL** |
| 1.3 | Parallel Payment | Firing two API calls to pay the same Bill simultaneously. | **CRITICAL** |
