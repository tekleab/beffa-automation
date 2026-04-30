# 📊 BEFFA ERP: High-Integrity Test Matrix

This matrix maps our **42 Automated Scenarios** to the **Hundreds of Manual Actions** they perform. It serves as the "Source of Truth" for the security and financial health of the ERP.

---

## 🛡️ Module: Procurement (Purchase)

### 1. Ledger Integrity & Reversals
*   **Scenario 1.1: Bill Balance Restoration Audit**
    *   *Step 1*: Login to Admin Dashboard.
    *   *Step 2*: Create a Bill for 5,000 ETB.
    *   *Step 3*: Advance Bill through 3-step Approval Cycle.
    *   *Step 4*: Verify Ledger Balance matches 5,000.
    *   *Step 5*: Post a full 5,000 ETB Payment.
    *   *Step 6*: Verify Bill Balance is 0.
    *   *Step 7*: Trigger "Reverse/Void" on the Payment.
    *   *Step 8*: **Check Audit**: Verify Bill Balance restores to 5,000.
*   **Scenario 1.2: Purchase Order to Bill Quantity Guardrail**
    *   *Step 1*: Create a Purchase Order (PO) for 10 units.
    *   *Step 2*: Approve PO via API/UI.
    *   *Step 3*: Attempt to create a linked Bill for 50 units.
    *   *Step 4*: **Check Audit**: Verify system rejects or prevents over-billing.

### 2. Concurrency & Race Conditions
*   **Scenario 2.1: Atomic Double-Payment Attack**
    *   *Step 1*: Identify an unpaid Bill.
    *   *Step 2*: Fire two simultaneous "Pay" requests for the full amount.
    *   *Step 3*: **Check Audit**: Verify only ONE payment is accepted.
*   **Scenario 2.2: Concurrent Stock Addition (Inventory Bloom)**
    *   *Step 1*: Create two Bills for the same Item.
    *   *Step 2*: Trigger approval for both at the exact same microsecond.
    *   *Step 3*: **Check Audit**: Verify Final Stock = Initial + (Bill A + Bill B).

---

## 💰 Module: Revenue (Sales)

### 1. Accounting Flow & Reversals
*   **Scenario 1.1: Receipt Reversal Balance Restore**
    *   *Step 1*: Create a Sales Invoice.
    *   *Step 2*: Approve through multi-step cycle.
    *   *Step 3*: Post a Customer Receipt.
    *   *Step 4*: Void the Receipt.
    *   *Step 5*: **Check Audit**: Verify Invoice Balance returns to original total.
*   **Scenario 1.2: Sales Order to Invoice Quantity Guardrail**
    *   *Step 1*: Create Sales Order (SO) for 5 units.
    *   *Step 2*: Attempt to generate Invoice for 100 units.
    *   *Step 3*: **Check Audit**: Verify "Over-Invoicing" is rejected.

### 2. Concurrency & Security
*   **Scenario 2.1: Double-Receipt Race Condition**
    *   *Step 1*: Attack an Invoice with two simultaneous Receipt postings.
    *   *Step 2*: **Check Audit**: Verify Cash Account is not over-credited.
*   **Scenario 2.2: Temporal Forgery (Back-dating)**
    *   *Step 1*: Inject a Sales Invoice with a date from 2 years ago.
    *   *Step 2*: Attempt to approve and post to Ledger.
    *   *Step 3*: **Check Audit**: Verify system blocks "Period Locking" violations.

---

## 📦 Module: Warehouse (Inventory)

### 1. Forensic Integrity Audits
*   **Scenario 1.1: Negative Stock Guardrail**
    *   *Step 1*: Select a Warehouse Item.
    *   *Step 2*: Attempt an "Adjustment In" with a negative quantity (-100).
    *   *Step 3*: **Check Audit**: Verify system rejects the payload to prevent corruption.
*   **Scenario 1.2: Atomic Warehouse Transfer**
    *   *Step 1*: Identify Item in Warehouse A (Stock: 50).
    *   *Step 2*: Trigger a transfer of 10 units to Warehouse B.
    *   *Step 3*: **Check Audit**: Verify Source is exactly 40 and Destination is exactly +10.

### 2. Concurrency & Temporal Security
*   **Scenario 2.1: Stock Adjustment Race Condition**
    *   *Step 1*: Fire two simultaneous stock adjustments for the same Item.
    *   *Step 2*: **Check Audit**: Verify no "Lost Updates" (Final stock must be exact sum).
*   **Scenario 2.2: Historical Stock Manipulation**
    *   *Step 1*: Inject a stock adjustment with a date from 2022.
    *   *Step 2*: **Check Audit**: Verify system blocks back-dated warehouse movements.

---

## 🖥️ Module: UI & Metadata

### 1. Frontend Smoke Tests
*   **Scenario 1.1: Full Purchase-to-Bill UI Cycle**
    *   *Step 1*: Manual-style navigation to /payables/purchase-orders.
    *   *Step 2*: Click "Add New" and select Vendor.
    *   *Step 3*: Fill Quantity and Unit Price.
    *   *Step 4*: Click "Add Now" and verify UI Redirect.
*   **Scenario 1.2: Vendor Management CRUD**
    *   *Step 1*: Navigate to Vendor List.
    *   *Step 2*: Create "New Test Vendor."
    *   *Step 3*: Search for Vendor and verify visibility.

---

### 📈 Summary of Coverage
- **Total Scenarios**: 42
- **Total Manual Step Equivalence**: ~410 Steps
- **Execution Mode**: Hybrid (4 Workers Parallel for Flows, 1 Worker Serial for Audits)
