# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/po-partial-release.spec.ts >> Procurement Partial PO Release Audit @purchase @logic @regression @full >> Audit: Partial PO release correctly tracks remaining unreceived quantity
- Location: tests/purchase/po-partial-release.spec.ts:42:9

# Error details

```
Error: page.evaluate: SecurityError: Failed to read the 'localStorage' property from 'Window': Access is denied for this document.
    at UtilityScript.evaluate (<anonymous>:304:16)
    at UtilityScript.<anonymous> (<anonymous>:1:44)
```