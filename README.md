# BEFFA ERP Automation (Playwright)

## 🚀 Overview
This project contains end-to-end automated tests for the **BEFFA ERP** system using Playwright. The focus is on validating real-world business workflows, ensuring data consistency across modules, and verifying how transactions impact inventory and accounting.

---

## 🛠 Tech Stack
* **Framework:** Playwright
* **Language:** JavaScript (Node.js)
* **CI/CD:** GitHub Actions
* **Environment Management:** Dotenv

---

## 📋 Prerequisites
* **Node.js:** v20.0.0 or higher
* **npm:** v10.0.0 or higher
* **OS:** Windows, macOS, or Linux

---

## ⚙️ Setup & Installation

### 1. Clone the Repository
```bash
git clone [https://github.com/tekleab/befffa-automation.git](https://github.com/tekleab/befffa-automation.git)
cd befffa-automation
npm install
2. Configure Environment Variables
Create a file named .env in the root directory and add your credentials:
BEFFA_URL=[https://your-erp-link.com](https://your-erp-link.com)
BEFFA_USER=your_username
BEFFA_PASS=your_password
3. Run Tests
# Run all tests
npx playwright test

# Run a specific test in headed mode
npx playwright test tests/e2e/receipt.spec.js --headed

# Show test report
npx playwright show-report
