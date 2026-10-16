# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hr/hr-payroll.spec.ts >> Payroll: Runs & Pay Components @hr @smoke >> API: Pay structure must be created with valid name
- Location: tests/hr/hr-payroll.spec.ts:39:9

# Error details

```
Error: Create pay-structure failed: 400 - {
	"code": 400,
	"message": "Company not found"
}

```

# Test source

```ts
  45  |                 localStorage.setItem('token', t);
  46  |                 localStorage.setItem('auth-token', t);
  47  |               } catch {}
  48  |             }, newToken).catch(() => {});
  49  |             token = newToken;
  50  |           }
  51  |         }
  52  |       } catch (e: any) {
  53  |         console.log(`[HR] Re-auth failed: ${e.message}`);
  54  |       }
  55  |       token = token || await this._getAuthToken();
  56  |     }
  57  |     return {
  58  |       'Authorization': `Bearer ${token}`,
  59  |       'x-company': this.company,
  60  |       'Content-Type': 'application/json',
  61  |     };
  62  |   }
  63  | 
  64  |   async createEmployee(data: Record<string, any>): Promise<any> {
  65  |     const h = await this.headers();
  66  |     let resp: any;
  67  |     let text = '';
  68  |     for (let attempt = 1; attempt <= 3; attempt++) {
  69  |       resp = await this.page.request.post(
  70  |         `${this.apiBase}/employees?${this.params}`, { headers: h, data, timeout: 30000 }
  71  |       );
  72  |       text = await resp.text();
  73  |       if (resp.ok() || resp.status() !== 500) break;
  74  |       console.warn(`[HR] createEmployee attempt ${attempt} returned 500. Retrying in ${attempt * 2000}ms...`);
  75  |       await this.page.waitForTimeout(attempt * 2000);
  76  |     }
  77  |     if (!resp.ok()) throw new Error(`Create employee failed: ${resp.status()} - ${text}`);
  78  | 
  79  |     // Try to parse direct response first
  80  |     if (text && text.trim() !== 'null' && text.trim() !== '') {
  81  |       try {
  82  |         const parsed = JSON.parse(text);
  83  |         if (parsed?.id) return parsed;
  84  |         if (parsed?.data?.id) return parsed.data;
  85  |         if (parsed?.employee?.id) return parsed.employee;
  86  |         if (Array.isArray(parsed?.data) && parsed.data[0]?.id) return parsed.data[0];
  87  |       } catch {}
  88  |     }
  89  | 
  90  |     // Fallback: search by email with retries — backend may not index instantly
  91  |     const email = data.email as string;
  92  |     const name = data.name as string;
  93  |     // Initial wait — backend creates the record async after returning null
  94  |     await this.page.waitForTimeout(4000);
  95  |     for (let attempt = 0; attempt < 7; attempt++) {
  96  |       // Try direct email search first with pageSize=100
  97  |       const emailResp = await this.safeGet(
  98  |         `${this.apiBase}/employees?page=1&pageSize=100&search=${encodeURIComponent(email)}&${this.params}`, { headers: h });
  99  |       if (emailResp.ok()) {
  100 |         const emailList = (await emailResp.json()).data || [];
  101 |         const byEmail = emailList.find((e: any) => e.email === email);
  102 |         if (byEmail) return byEmail;
  103 |       }
  104 |       // Fallback: search page 1 and last page (since newly created employees are appended at the end of the database)
  105 |       const listResp = await this.safeGet(
  106 |         `${this.apiBase}/employees?page=1&pageSize=100&${this.params}`, { headers: h });
  107 |       if (listResp.ok()) {
  108 |         const listJson = await listResp.json();
  109 |         const list = listJson.data || listJson.items || (Array.isArray(listJson) ? listJson : []);
  110 |         const totalRecords = parseInt(listJson.pagination?.total || listJson.total || '0', 10);
  111 |         const pageSize = parseInt(listJson.pagination?.pageSize || '100', 10);
  112 |         const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  113 |         console.log(`[HR] Attempt ${attempt + 1}: list total records=${totalRecords} (pages=${totalPages}) | checking ${list.length} rows for email=${email}`);
  114 |         let found = list.find((e: any) => e.email === email)
  115 |           || list.find((e: any) => e.name === name || e.full_name === name
  116 |             || (e.full_name || '').toLowerCase().includes(name.toLowerCase())
  117 |             || (e.name || '').toLowerCase().includes(name.toLowerCase()));
  118 |         
  119 |         if (!found && totalPages > 1) {
  120 |           console.log(`[HR] Fetching last page ${totalPages} for newly appended employee...`);
  121 |           const lastResp = await this.safeGet(
  122 |             `${this.apiBase}/employees?page=${totalPages}&pageSize=100&${this.params}`, { headers: h });
  123 |           if (lastResp.ok()) {
  124 |             const lastJson = await lastResp.json();
  125 |             const lastList = lastJson.data || lastJson.items || [];
  126 |             found = lastList.find((e: any) => e.email === email)
  127 |               || lastList.find((e: any) => e.name === name || e.full_name === name
  128 |                 || (e.full_name || '').toLowerCase().includes(name.toLowerCase())
  129 |                 || (e.name || '').toLowerCase().includes(name.toLowerCase()));
  130 |           }
  131 |         }
  132 |         if (found) return found;
  133 |       }
  134 |       await this.page.waitForTimeout(3000);
  135 |     }
  136 |     throw new Error(`Create employee: could not retrieve created employee "${name}" - response: ${text.slice(0, 200)}`);
  137 |   }
  138 | 
  139 |   async createPayStructure(name: string, description = ''): Promise<any> {
  140 |     const h = await this.headers();
  141 |     const resp = await this.page.request.post(
  142 |       `${this.apiBase}/pay-structures?${this.params}`,
  143 |       { headers: h, data: { name, description }, timeout: 30000 }
  144 |     );
> 145 |     if (!resp.ok()) throw new Error(`Create pay-structure failed: ${resp.status()} - ${await resp.text()}`);
      |                           ^ Error: Create pay-structure failed: 400 - {
  146 |     return resp.json();
  147 |   }
  148 | 
  149 |   async listEmployees(pageSize = 10): Promise<any[]> {
  150 |     const h = await this.headers();
  151 |     const resp = await this.safeGet(
  152 |       `${this.apiBase}/employees?page=1&pageSize=${pageSize}&${this.params}`, { headers: h });
  153 |     if (!resp.ok()) throw new Error(`List employees failed: ${resp.status()}`);
  154 |     return (await resp.json()).data || [];
  155 |   }
  156 | 
  157 |   async getEmployee(id: string): Promise<any> {
  158 |     const h = await this.headers();
  159 |     let resp = await this.safeGet(
  160 |       `${this.apiBase}/employees/${id}?${this.params}`, { headers: h });
  161 |     if (!resp.ok() && resp.status() === 404) {
  162 |       resp = await this.safeGet(
  163 |         `${this.apiBase}/employee/${id}?${this.params}`, { headers: h });
  164 |     }
  165 |     if (resp.ok()) {
  166 |       const json = await resp.json();
  167 |       return json.data || json.employee || json;
  168 |     }
  169 |     // Fallback: list scan (check page 1 and last page)
  170 |     const listResp = await this.safeGet(
  171 |       `${this.apiBase}/employees?page=1&pageSize=100&${this.params}`, { headers: h });
  172 |     if (listResp.ok()) {
  173 |       const listJson = await listResp.json();
  174 |       const list = listJson.data || listJson.items || [];
  175 |       let found = list.find((e: any) => e.id === id);
  176 |       if (found) return found;
  177 | 
  178 |       const totalPages = parseInt(listJson.pagination?.total || listJson.total || '1', 10);
  179 |       if (totalPages > 1) {
  180 |         const lastResp = await this.safeGet(
  181 |           `${this.apiBase}/employees?page=${totalPages}&pageSize=100&${this.params}`, { headers: h });
  182 |         if (lastResp.ok()) {
  183 |           const lastJson = await lastResp.json();
  184 |           const lastList = lastJson.data || lastJson.items || [];
  185 |           found = lastList.find((e: any) => e.id === id);
  186 |           if (found) return found;
  187 |         }
  188 |       }
  189 |     }
  190 |     throw new Error(`Get employee failed: ${resp.status()}`);
  191 |   }
  192 | 
  193 |   async listTimesheets(pageSize = 10): Promise<any[]> {
  194 |     const h = await this.headers();
  195 |     const resp = await this.safeGet(
  196 |       `${this.apiBase}/timesheets?page=1&pageSize=${pageSize}&${this.params}`, { headers: h });
  197 |     if (!resp.ok()) throw new Error(`List timesheets failed: ${resp.status()}`);
  198 |     return (await resp.json()).data || [];
  199 |   }
  200 | 
  201 |   async createTimesheet(employeeId: string, date: string, hours: number, description = 'Audit Timesheet'): Promise<any> {
  202 |     const h = await this.headers();
  203 |     const resp = await this.page.request.post(
  204 |       `${this.apiBase}/timesheets?${this.params}`,
  205 |       { headers: h, data: { employee_id: employeeId, date, hours, description }, timeout: 30000 }
  206 |     );
  207 |     if (!resp.ok()) throw new Error(`Create timesheet failed: ${resp.status()} - ${await resp.text()}`);
  208 |     return resp.json();
  209 |   }
  210 | 
  211 |   async listLeaveApplications(pageSize = 10): Promise<any[]> {
  212 |     const h = await this.headers();
  213 |     const resp = await this.safeGet(
  214 |       `${this.apiBase}/leave-applications?page=1&pageSize=${pageSize}&${this.params}`, { headers: h });
  215 |     if (!resp.ok()) throw new Error(`List leave-applications failed: ${resp.status()}`);
  216 |     return (await resp.json()).data || [];
  217 |   }
  218 | 
  219 |   async listPayrollRuns(pageSize = 10): Promise<any[]> {
  220 |     const h = await this.headers();
  221 |     const resp = await this.safeGet(
  222 |       `${this.apiBase}/payroll-runs?page=1&pageSize=${pageSize}&${this.params}`, { headers: h });
  223 |     if (!resp.ok()) throw new Error(`List payroll-runs failed: ${resp.status()}`);
  224 |     return (await resp.json()).data || [];
  225 |   }
  226 | 
  227 |   async createPayrollRun(name: string, startDate: string, endDate: string, payDate: string): Promise<any> {
  228 |     const h = await this.headers();
  229 |     const resp = await this.page.request.post(
  230 |       `${this.apiBase}/payroll-runs?${this.params}`,
  231 |       { headers: h, data: { event_name: name, start_date: startDate, end_date: endDate, pay_date: payDate }, timeout: 30000 }
  232 |     );
  233 |     if (!resp.ok()) throw new Error(`Create payroll-run failed: ${resp.status()} - ${await resp.text()}`);
  234 |     return resp.json();
  235 |   }
  236 | 
  237 |   async getPayrollRun(id: string): Promise<any> {
  238 |     const h = await this.headers();
  239 |     const resp = await this.safeGet(
  240 |       `${this.apiBase}/payroll-runs/${id}?${this.params}`, { headers: h });
  241 |     if (!resp.ok()) throw new Error(`Get payroll-run failed: ${resp.status()}`);
  242 |     return resp.json();
  243 |   }
  244 | 
  245 |   async listPayComponents(pageSize = 10): Promise<any[]> {
```