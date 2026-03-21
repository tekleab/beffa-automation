BEFFA ERP Automation (Playwright)
🚀 Overview

This project contains end-to-end automated tests for the BEFFA ERP system using Playwright.
The focus is on validating real-world business workflows, ensuring data consistency across modules, and verifying how transactions impact inventory and accounting.

🛠 Tech Stack
Framework: Playwright
Language: JavaScript (Node.js)
CI/CD: GitHub Actions
Environment Management: Dotenv
📋 Prerequisites
Node.js: v20.0.0 or higher
npm: v10.0.0 or higher
OS: Windows, macOS, or Linux
⚙️ Setup & Installation
1. Clone the Repository
git clone https://github.com/tekleab/befffa-automation.git
cd befffa-automation
2. Install Dependencies
npm install
3. Configure Environment

Create a .env file in the root directory with your ERP credentials:

BEFFA_URL=https://your-erp-link.com
BEFFA_USER=your_username
BEFFA_PASS=your_password
🧪 Running Tests
Execute All Tests
npx playwright test
Run a Specific Test (Headed Mode)
npx playwright test tests/e2e/receipt.spec.js --headed
View Test Report
npx playwright show-report
📋 Tested Workflows (Core Completed)
Sales → Invoice → Receipt → Inventory + GL
Create Sales Order
Convert to Invoice
Process Receipt
Verify stock reduction in Inventory
Verify accounting impact in GL
Customer Management (CRM)
Create customer with full address hierarchy (Region → Zone → Wereda)
Validate required fields (Name, TIN, Phone)
Verify auto-generated Customer ID
⚠️ Project Status
Core sales workflow: Fully tested
Purchase workflow: In progress (Inventory + GL validation)
Other modules: HRM, Lease, Service Management planned for future coverage
👤 Author

Tekleab – QA Engineer (Automation & ERP Systems)
