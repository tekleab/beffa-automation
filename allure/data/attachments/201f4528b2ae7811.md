# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales/so-accounting.spec.ts >> Accounting & Ledger Flow Logic Audits @sales @logic @regression @full >> Guardrail: System must prevent double-dip overpayments across multi-link receipts
- Location: tests/sales/so-accounting.spec.ts:113:9

# Error details

```
Error: page.evaluate: SecurityError: Failed to read the 'localStorage' property from 'Window': Access is denied for this document.
    at UtilityScript.evaluate (<anonymous>:304:16)
    at UtilityScript.<anonymous> (<anonymous>:1:44)
```