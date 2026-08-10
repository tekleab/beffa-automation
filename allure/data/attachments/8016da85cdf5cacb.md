# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: project/project-ui-list.spec.ts >> Project Management: UI List Page @project @ui @smoke @regression @full >> UI-01: Projects list page loads with all key table columns
- Location: tests/project/project-ui-list.spec.ts:33:9

# Error details

```
Error: Column "Project Name" not visible

expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e5]:
    - generic [ref=e6]:
      - img [ref=e10]
      - generic:
        - generic:
          - generic:
            - img
      - navigation [ref=e13]:
        - link [ref=e14] [cursor=pointer]:
          - /url: /dashboard
      - generic [ref=e52]:
        - button [ref=e54] [cursor=pointer]:
          - generic:
            - generic:
              - img
        - navigation [ref=e56]:
          - link [ref=e58] [cursor=pointer]:
            - /url: /settings/general/users
            - img [ref=e61]
        - button [ref=e63] [cursor=pointer]:
          - img [ref=e65]
    - generic [ref=e67]:
      - generic [ref=e68]:
        - generic [ref=e69]:
          - img "BM Tech" [ref=e71]: BT
          - generic [ref=e72]:
            - button "BM Tech" [ref=e73] [cursor=pointer]:
              - generic: BM Tech
              - img [ref=e75]
            - generic [ref=e77] [cursor=pointer]:
              - button "Company Detail" [ref=e78]:
                - img [ref=e79]
              - button "Edit Company" [ref=e82]:
                - img [ref=e83]
              - button "Company Detail" [ref=e86]:
                - img [ref=e87]
        - generic [ref=e90]:
          - button "New" [ref=e91] [cursor=pointer]:
            - text: New
            - img [ref=e93]
          - img "Notifications" [ref=e98] [cursor=pointer]
          - button "Loading... EC" [disabled] [ref=e101]:
            - generic [ref=e104]: Loading...
            - generic [ref=e105]:
              - img [ref=e106]
              - paragraph [ref=e108]: EC
          - button [ref=e109] [cursor=pointer]:
            - img [ref=e110]
          - generic [ref=e113] [cursor=pointer]:
            - img "System" [ref=e115]: S
            - generic [ref=e116]:
              - generic [ref=e117]: System
              - paragraph [ref=e118]: IT Administrator / User Manager
      - generic [ref=e119]:
        - generic [ref=e120]:
          - generic [ref=e121]:
            - navigation "breadcrumb" [ref=e122]:
              - list [ref=e123]:
                - navigation "breadcrumb" [ref=e124]:
                  - list [ref=e125]:
                    - listitem [ref=e126]:
                      - link "Home" [ref=e127] [cursor=pointer]:
                        - /url: /
                      - text: /
                    - listitem [ref=e128]:
                      - link "Project Management" [ref=e129] [cursor=pointer]:
                        - /url: /project-management
                      - text: /
                    - listitem [ref=e130]:
                      - link "Projects" [ref=e131] [cursor=pointer]:
                        - /url: /project-management/projects
            - button "Loading... 2019" [disabled] [ref=e133]:
              - generic [ref=e136]: Loading...
              - generic [ref=e137]:
                - text: "2019"
                - img [ref=e138]
          - generic [ref=e142]:
            - group [ref=e144]:
              - radio "Advanced filters" [ref=e145] [cursor=pointer]:
                - img
                - text: Advanced filters
              - radio "Command filters" [ref=e146] [cursor=pointer]:
                - img
                - text: Command filters
            - generic [ref=e148]:
              - generic [ref=e149]:
                - button "Add Project" [ref=e151] [cursor=pointer]:
                  - img [ref=e153]
                  - text: Add Project
                  - img [ref=e156]
                - button "Export" [ref=e158] [cursor=pointer]:
                  - img [ref=e160]
                  - text: Export
              - generic [ref=e162]:
                - toolbar [ref=e163]:
                  - generic [ref=e164]:
                    - textbox "Search names..." [ref=e165]
                    - button "Workspace" [ref=e166] [cursor=pointer]:
                      - button "Workspace" [ref=e167]:
                        - img
                        - text: Workspace
                    - button "Workflow" [ref=e168] [cursor=pointer]:
                      - button "Workflow" [ref=e169]:
                        - img
                        - text: Workflow
                    - button "Start Date" [ref=e170] [cursor=pointer]:
                      - button "Start Date" [ref=e171]:
                        - img
                        - generic [ref=e173]: Start Date
                    - button "End Date" [ref=e174] [cursor=pointer]:
                      - button "End Date" [ref=e175]:
                        - img
                        - generic [ref=e177]: End Date
                    - button "Status" [ref=e178] [cursor=pointer]:
                      - button "Status" [ref=e179]:
                        - img
                        - text: Status
                    - button "Progress" [ref=e180] [cursor=pointer]:
                      - button "Progress" [ref=e181]:
                        - img
                        - generic [ref=e182]: Progress
                    - button "Budget" [ref=e183] [cursor=pointer]:
                      - button "Budget" [ref=e184]:
                        - img
                        - generic [ref=e185]: Budget
                  - generic [ref=e186]:
                    - button "Sort" [ref=e187] [cursor=pointer]:
                      - button "Sort" [ref=e188]:
                        - img
                        - text: Sort
                    - button [ref=e189] [cursor=pointer]:
                      - combobox "Toggle columns" [ref=e190]:
                        - img
                        - text: View
                        - img
                - table [ref=e193]:
                  - rowgroup [ref=e194]:
                    - row "Select all Project Name Workspace Workflow Customer Start Date End Date Status Progress Budget Tasks" [ref=e195]:
                      - columnheader "Select all" [ref=e196]:
                        - checkbox "Select all" [ref=e197] [cursor=pointer]
                      - columnheader "Project Name" [ref=e198]:
                        - button "Project Name" [ref=e199] [cursor=pointer]:
                          - text: Project Name
                          - img [ref=e200]
                      - columnheader "Workspace" [ref=e203]:
                        - button "Workspace" [ref=e204] [cursor=pointer]:
                          - text: Workspace
                          - img [ref=e205]
                      - columnheader "Workflow" [ref=e208]:
                        - button "Workflow" [ref=e209] [cursor=pointer]:
                          - text: Workflow
                          - img [ref=e210]
                      - columnheader "Customer" [ref=e213]:
                        - button "Customer" [ref=e214] [cursor=pointer]:
                          - text: Customer
                          - img [ref=e215]
                      - columnheader "Start Date" [ref=e218]:
                        - button "Start Date" [ref=e219] [cursor=pointer]:
                          - text: Start Date
                          - img [ref=e220]
                      - columnheader "End Date" [ref=e223]:
                        - button "End Date" [ref=e224] [cursor=pointer]:
                          - text: End Date
                          - img [ref=e225]
                      - columnheader "Status" [ref=e228]:
                        - button "Status" [ref=e229] [cursor=pointer]:
                          - text: Status
                          - img [ref=e230]
                      - columnheader "Progress" [ref=e233]:
                        - button "Progress" [ref=e234] [cursor=pointer]:
                          - text: Progress
                          - img [ref=e235]
                      - columnheader "Budget" [ref=e238]:
                        - button "Budget" [ref=e239] [cursor=pointer]:
                          - text: Budget
                          - img [ref=e240]
                      - columnheader "Tasks" [ref=e243]:
                        - button "Tasks" [ref=e244] [cursor=pointer]
                      - columnheader [ref=e245]
                  - rowgroup [ref=e246]:
                    - row "Select row E2E-Project-1786339603453-5626 PROJ-0414 N/A N/A Base Ethiopia August 10, 2026 August 10, 2027 Pending 0% Tasks" [ref=e247]:
                      - cell "Select row" [ref=e248]:
                        - checkbox "Select row" [ref=e249] [cursor=pointer]
                      - cell "E2E-Project-1786339603453-5626 PROJ-0414" [ref=e250]:
                        - generic [ref=e251]:
                          - link "E2E-Project-1786339603453-5626" [ref=e252] [cursor=pointer]:
                            - /url: /project-management/projects/76d3d135-4299-4d8e-a754-ba92cdf08879/tasks
                          - generic [ref=e253]: PROJ-0414
                      - cell "N/A" [ref=e254]:
                        - generic [ref=e255]: N/A
                      - cell "N/A" [ref=e256]:
                        - generic [ref=e257]: N/A
                      - cell "Base Ethiopia" [ref=e258]:
                        - generic [ref=e259]: Base Ethiopia
                      - cell "August 10, 2026" [ref=e260]
                      - cell "August 10, 2027" [ref=e261]
                      - cell "Pending" [ref=e262]:
                        - generic [ref=e263]:
                          - img
                          - text: Pending
                      - cell "0%" [ref=e264]:
                        - generic [ref=e267]: 0%
                      - cell [ref=e268]
                      - cell "Tasks" [ref=e269]:
                        - link "Tasks" [ref=e271] [cursor=pointer]:
                          - /url: /project-management/projects/76d3d135-4299-4d8e-a754-ba92cdf08879/tasks
                          - img
                          - text: Tasks
                      - cell [ref=e272]:
                        - button [ref=e273] [cursor=pointer]:
                          - button [ref=e274]:
                            - img
                    - row "Select row E2E-Project-1786339597137-2656 PROJ-0413 N/A N/A Base Ethiopia August 10, 2026 August 10, 2027 Pending 0% Tasks" [ref=e275]:
                      - cell "Select row" [ref=e276]:
                        - checkbox "Select row" [ref=e277] [cursor=pointer]
                      - cell "E2E-Project-1786339597137-2656 PROJ-0413" [ref=e278]:
                        - generic [ref=e279]:
                          - link "E2E-Project-1786339597137-2656" [ref=e280] [cursor=pointer]:
                            - /url: /project-management/projects/fae2b9f4-81f2-4277-936d-9889548b4838/tasks
                          - generic [ref=e281]: PROJ-0413
                      - cell "N/A" [ref=e282]:
                        - generic [ref=e283]: N/A
                      - cell "N/A" [ref=e284]:
                        - generic [ref=e285]: N/A
                      - cell "Base Ethiopia" [ref=e286]:
                        - generic [ref=e287]: Base Ethiopia
                      - cell "August 10, 2026" [ref=e288]
                      - cell "August 10, 2027" [ref=e289]
                      - cell "Pending" [ref=e290]:
                        - generic [ref=e291]:
                          - img
                          - text: Pending
                      - cell "0%" [ref=e292]:
                        - generic [ref=e295]: 0%
                      - cell [ref=e296]
                      - cell "Tasks" [ref=e297]:
                        - link "Tasks" [ref=e299] [cursor=pointer]:
                          - /url: /project-management/projects/fae2b9f4-81f2-4277-936d-9889548b4838/tasks
                          - img
                          - text: Tasks
                      - cell [ref=e300]:
                        - button [ref=e301] [cursor=pointer]:
                          - button [ref=e302]:
                            - img
                    - row "Select row E2E-Project-1786339596998-7808 PROJ-0412 N/A N/A Base Ethiopia August 10, 2026 August 10, 2027 Pending 0% Tasks" [ref=e303]:
                      - cell "Select row" [ref=e304]:
                        - checkbox "Select row" [ref=e305] [cursor=pointer]
                      - cell "E2E-Project-1786339596998-7808 PROJ-0412" [ref=e306]:
                        - generic [ref=e307]:
                          - link "E2E-Project-1786339596998-7808" [ref=e308] [cursor=pointer]:
                            - /url: /project-management/projects/2b6b3221-a182-4d82-b9d4-0429c092eb43/tasks
                          - generic [ref=e309]: PROJ-0412
                      - cell "N/A" [ref=e310]:
                        - generic [ref=e311]: N/A
                      - cell "N/A" [ref=e312]:
                        - generic [ref=e313]: N/A
                      - cell "Base Ethiopia" [ref=e314]:
                        - generic [ref=e315]: Base Ethiopia
                      - cell "August 10, 2026" [ref=e316]
                      - cell "August 10, 2027" [ref=e317]
                      - cell "Pending" [ref=e318]:
                        - generic [ref=e319]:
                          - img
                          - text: Pending
                      - cell "0%" [ref=e320]:
                        - generic [ref=e323]: 0%
                      - cell [ref=e324]
                      - cell "Tasks" [ref=e325]:
                        - link "Tasks" [ref=e327] [cursor=pointer]:
                          - /url: /project-management/projects/2b6b3221-a182-4d82-b9d4-0429c092eb43/tasks
                          - img
                          - text: Tasks
                      - cell [ref=e328]:
                        - button [ref=e329] [cursor=pointer]:
                          - button [ref=e330]:
                            - img
                    - row "Select row Guardrail-Base-1786339596665-5978 PROJ-0411 N/A N/A Base Ethiopia August 10, 2026 August 10, 2027 Pending 0% Tasks" [ref=e331]:
                      - cell "Select row" [ref=e332]:
                        - checkbox "Select row" [ref=e333] [cursor=pointer]
                      - cell "Guardrail-Base-1786339596665-5978 PROJ-0411" [ref=e334]:
                        - generic [ref=e335]:
                          - link "Guardrail-Base-1786339596665-5978" [ref=e336] [cursor=pointer]:
                            - /url: /project-management/projects/bd231484-0da7-4056-b4a7-1f8ba0781db6/tasks
                          - generic [ref=e337]: PROJ-0411
                      - cell "N/A" [ref=e338]:
                        - generic [ref=e339]: N/A
                      - cell "N/A" [ref=e340]:
                        - generic [ref=e341]: N/A
                      - cell "Base Ethiopia" [ref=e342]:
                        - generic [ref=e343]: Base Ethiopia
                      - cell "August 10, 2026" [ref=e344]
                      - cell "August 10, 2027" [ref=e345]
                      - cell "Pending" [ref=e346]:
                        - generic [ref=e347]:
                          - img
                          - text: Pending
                      - cell "0%" [ref=e348]:
                        - generic [ref=e351]: 0%
                      - cell [ref=e352]
                      - cell "Tasks" [ref=e353]:
                        - link "Tasks" [ref=e355] [cursor=pointer]:
                          - /url: /project-management/projects/bd231484-0da7-4056-b4a7-1f8ba0781db6/tasks
                          - img
                          - text: Tasks
                      - cell [ref=e356]:
                        - button [ref=e357] [cursor=pointer]:
                          - button [ref=e358]:
                            - img
                    - row "Select row Guardrail-Base-1786339586586-8442 PROJ-0410 N/A N/A Base Ethiopia August 10, 2026 August 10, 2027 Pending 0% Tasks" [ref=e359]:
                      - cell "Select row" [ref=e360]:
                        - checkbox "Select row" [ref=e361] [cursor=pointer]
                      - cell "Guardrail-Base-1786339586586-8442 PROJ-0410" [ref=e362]:
                        - generic [ref=e363]:
                          - link "Guardrail-Base-1786339586586-8442" [ref=e364] [cursor=pointer]:
                            - /url: /project-management/projects/ae30a5c3-d2d6-42c3-bffd-6c35bf2efff9/tasks
                          - generic [ref=e365]: PROJ-0410
                      - cell "N/A" [ref=e366]:
                        - generic [ref=e367]: N/A
                      - cell "N/A" [ref=e368]:
                        - generic [ref=e369]: N/A
                      - cell "Base Ethiopia" [ref=e370]:
                        - generic [ref=e371]: Base Ethiopia
                      - cell "August 10, 2026" [ref=e372]
                      - cell "August 10, 2027" [ref=e373]
                      - cell "Pending" [ref=e374]:
                        - generic [ref=e375]:
                          - img
                          - text: Pending
                      - cell "0%" [ref=e376]:
                        - generic [ref=e379]: 0%
                      - cell [ref=e380]
                      - cell "Tasks" [ref=e381]:
                        - link "Tasks" [ref=e383] [cursor=pointer]:
                          - /url: /project-management/projects/ae30a5c3-d2d6-42c3-bffd-6c35bf2efff9/tasks
                          - img
                          - text: Tasks
                      - cell [ref=e384]:
                        - button [ref=e385] [cursor=pointer]:
                          - button [ref=e386]:
                            - img
                    - row "Select row Guardrail-Base-1786339586351-9198 PROJ-0409 N/A N/A Base Ethiopia August 10, 2026 August 10, 2027 Pending 0% Tasks" [ref=e387]:
                      - cell "Select row" [ref=e388]:
                        - checkbox "Select row" [ref=e389] [cursor=pointer]
                      - cell "Guardrail-Base-1786339586351-9198 PROJ-0409" [ref=e390]:
                        - generic [ref=e391]:
                          - link "Guardrail-Base-1786339586351-9198" [ref=e392] [cursor=pointer]:
                            - /url: /project-management/projects/b68a5974-bb46-4b81-8404-4799202f3499/tasks
                          - generic [ref=e393]: PROJ-0409
                      - cell "N/A" [ref=e394]:
                        - generic [ref=e395]: N/A
                      - cell "N/A" [ref=e396]:
                        - generic [ref=e397]: N/A
                      - cell "Base Ethiopia" [ref=e398]:
                        - generic [ref=e399]: Base Ethiopia
                      - cell "August 10, 2026" [ref=e400]
                      - cell "August 10, 2027" [ref=e401]
                      - cell "Pending" [ref=e402]:
                        - generic [ref=e403]:
                          - img
                          - text: Pending
                      - cell "0%" [ref=e404]:
                        - generic [ref=e407]: 0%
                      - cell [ref=e408]
                      - cell "Tasks" [ref=e409]:
                        - link "Tasks" [ref=e411] [cursor=pointer]:
                          - /url: /project-management/projects/b68a5974-bb46-4b81-8404-4799202f3499/tasks
                          - img
                          - text: Tasks
                      - cell [ref=e412]:
                        - button [ref=e413] [cursor=pointer]:
                          - button [ref=e414]:
                            - img
                    - row "Select row E2E-Project-1786339566876-4031 PROJ-0408 N/A N/A Base Ethiopia August 10, 2026 August 10, 2027 Pending 0% Tasks" [ref=e415]:
                      - cell "Select row" [ref=e416]:
                        - checkbox "Select row" [ref=e417] [cursor=pointer]
                      - cell "E2E-Project-1786339566876-4031 PROJ-0408" [ref=e418]:
                        - generic [ref=e419]:
                          - link "E2E-Project-1786339566876-4031" [ref=e420] [cursor=pointer]:
                            - /url: /project-management/projects/a8924594-deee-442e-92ee-bfe8718cb910/tasks
                          - generic [ref=e421]: PROJ-0408
                      - cell "N/A" [ref=e422]:
                        - generic [ref=e423]: N/A
                      - cell "N/A" [ref=e424]:
                        - generic [ref=e425]: N/A
                      - cell "Base Ethiopia" [ref=e426]:
                        - generic [ref=e427]: Base Ethiopia
                      - cell "August 10, 2026" [ref=e428]
                      - cell "August 10, 2027" [ref=e429]
                      - cell "Pending" [ref=e430]:
                        - generic [ref=e431]:
                          - img
                          - text: Pending
                      - cell "0%" [ref=e432]:
                        - generic [ref=e435]: 0%
                      - cell [ref=e436]
                      - cell "Tasks" [ref=e437]:
                        - link "Tasks" [ref=e439] [cursor=pointer]:
                          - /url: /project-management/projects/a8924594-deee-442e-92ee-bfe8718cb910/tasks
                          - img
                          - text: Tasks
                      - cell [ref=e440]:
                        - button [ref=e441] [cursor=pointer]:
                          - button [ref=e442]:
                            - img
                    - row "Select row E2E-Project-1786339566125-147 PROJ-0407 N/A N/A Base Ethiopia August 10, 2026 August 10, 2027 Pending 0% Tasks" [ref=e443]:
                      - cell "Select row" [ref=e444]:
                        - checkbox "Select row" [ref=e445] [cursor=pointer]
                      - cell "E2E-Project-1786339566125-147 PROJ-0407" [ref=e446]:
                        - generic [ref=e447]:
                          - link "E2E-Project-1786339566125-147" [ref=e448] [cursor=pointer]:
                            - /url: /project-management/projects/2a90b060-294c-4f38-9d3c-7316ce5a9db9/tasks
                          - generic [ref=e449]: PROJ-0407
                      - cell "N/A" [ref=e450]:
                        - generic [ref=e451]: N/A
                      - cell "N/A" [ref=e452]:
                        - generic [ref=e453]: N/A
                      - cell "Base Ethiopia" [ref=e454]:
                        - generic [ref=e455]: Base Ethiopia
                      - cell "August 10, 2026" [ref=e456]
                      - cell "August 10, 2027" [ref=e457]
                      - cell "Pending" [ref=e458]:
                        - generic [ref=e459]:
                          - img
                          - text: Pending
                      - cell "0%" [ref=e460]:
                        - generic [ref=e463]: 0%
                      - cell [ref=e464]
                      - cell "Tasks" [ref=e465]:
                        - link "Tasks" [ref=e467] [cursor=pointer]:
                          - /url: /project-management/projects/2a90b060-294c-4f38-9d3c-7316ce5a9db9/tasks
                          - img
                          - text: Tasks
                      - cell [ref=e468]:
                        - button [ref=e469] [cursor=pointer]:
                          - button [ref=e470]:
                            - img
                    - row "Select row E2E-Project-1786339560283-237 PROJ-0406 N/A N/A Base Ethiopia August 10, 2026 August 10, 2027 Pending 0% Tasks" [ref=e471]:
                      - cell "Select row" [ref=e472]:
                        - checkbox "Select row" [ref=e473] [cursor=pointer]
                      - cell "E2E-Project-1786339560283-237 PROJ-0406" [ref=e474]:
                        - generic [ref=e475]:
                          - link "E2E-Project-1786339560283-237" [ref=e476] [cursor=pointer]:
                            - /url: /project-management/projects/8dc89263-d5bd-4a4e-a36a-c6107db162bb/tasks
                          - generic [ref=e477]: PROJ-0406
                      - cell "N/A" [ref=e478]:
                        - generic [ref=e479]: N/A
                      - cell "N/A" [ref=e480]:
                        - generic [ref=e481]: N/A
                      - cell "Base Ethiopia" [ref=e482]:
                        - generic [ref=e483]: Base Ethiopia
                      - cell "August 10, 2026" [ref=e484]
                      - cell "August 10, 2027" [ref=e485]
                      - cell "Pending" [ref=e486]:
                        - generic [ref=e487]:
                          - img
                          - text: Pending
                      - cell "0%" [ref=e488]:
                        - generic [ref=e491]: 0%
                      - cell [ref=e492]
                      - cell "Tasks" [ref=e493]:
                        - link "Tasks" [ref=e495] [cursor=pointer]:
                          - /url: /project-management/projects/8dc89263-d5bd-4a4e-a36a-c6107db162bb/tasks
                          - img
                          - text: Tasks
                      - cell [ref=e496]:
                        - button [ref=e497] [cursor=pointer]:
                          - button [ref=e498]:
                            - img
                    - row "Select row E2E-Project-1786339556564-2720 PROJ-0405 N/A N/A Base Ethiopia August 10, 2026 August 10, 2027 Completed 0% Tasks" [ref=e499]:
                      - cell "Select row" [ref=e500]:
                        - checkbox "Select row" [ref=e501] [cursor=pointer]
                      - cell "E2E-Project-1786339556564-2720 PROJ-0405" [ref=e502]:
                        - generic [ref=e503]:
                          - link "E2E-Project-1786339556564-2720" [ref=e504] [cursor=pointer]:
                            - /url: /project-management/projects/301d26d4-28ef-4809-bd39-5f0e052d8da4/tasks
                          - generic [ref=e505]: PROJ-0405
                      - cell "N/A" [ref=e506]:
                        - generic [ref=e507]: N/A
                      - cell "N/A" [ref=e508]:
                        - generic [ref=e509]: N/A
                      - cell "Base Ethiopia" [ref=e510]:
                        - generic [ref=e511]: Base Ethiopia
                      - cell "August 10, 2026" [ref=e512]
                      - cell "August 10, 2027" [ref=e513]
                      - cell "Completed" [ref=e514]:
                        - generic [ref=e515]:
                          - img
                          - text: Completed
                      - cell "0%" [ref=e516]:
                        - generic [ref=e519]: 0%
                      - cell [ref=e520]
                      - cell "Tasks" [ref=e521]:
                        - link "Tasks" [ref=e523] [cursor=pointer]:
                          - /url: /project-management/projects/301d26d4-28ef-4809-bd39-5f0e052d8da4/tasks
                          - img
                          - text: Tasks
                      - cell [ref=e524]:
                        - button [ref=e525] [cursor=pointer]:
                          - button [ref=e526]:
                            - img
                - generic [ref=e528]:
                  - generic [ref=e529]: 0 of 10 row(s) selected.
                  - generic [ref=e530]:
                    - generic [ref=e531]:
                      - paragraph [ref=e532]: Rows per page
                      - combobox [ref=e533] [cursor=pointer]:
                        - generic: "10"
                        - img
                    - generic [ref=e534]: Page 1 of 42
                    - generic [ref=e535]:
                      - button "Go to first page" [disabled]:
                        - img
                      - button "Go to previous page" [disabled]:
                        - img
                      - button "Go to next page" [ref=e536] [cursor=pointer]:
                        - img
                      - button "Go to last page" [ref=e537] [cursor=pointer]:
                        - img
        - generic [ref=e538]: BM Technology © 2026
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
  - generic:
    - option "1950"
    - option "1951"
    - option "1952"
    - option "1953"
    - option "1954"
    - option "1955"
    - option "1956"
    - option "1957"
    - option "1958"
    - option "1959"
    - option "1960"
    - option "1961"
    - option "1962"
    - option "1963"
    - option "1964"
    - option "1965"
    - option "1966"
    - option "1967"
    - option "1968"
    - option "1969"
    - option "1970"
    - option "1971"
    - option "1972"
    - option "1973"
    - option "1974"
    - option "1975"
    - option "1976"
    - option "1977"
    - option "1978"
    - option "1979"
    - option "1980"
    - option "1981"
    - option "1982"
    - option "1983"
    - option "1984"
    - option "1985"
    - option "1986"
    - option "1987"
    - option "1988"
    - option "1989"
    - option "1990"
    - option "1991"
    - option "1992"
    - option "1993"
    - option "1994"
    - option "1995"
    - option "1996"
    - option "1997"
    - option "1998"
    - option "1999"
    - option "2000"
    - option "2001"
    - option "2002"
    - option "2003"
    - option "2004"
    - option "2005"
    - option "2006"
    - option "2007"
    - option "2008"
    - option "2009"
    - option "2010"
    - option "2011"
    - option "2012"
    - option "2013"
    - option "2014"
    - option "2015"
    - option "2016"
    - option "2017"
    - option "2018"
    - option "2019" [selected]
    - option "2020"
    - option "2021"
    - option "2022"
    - option "2023"
    - option "2024"
    - option "2025"
    - option "2026"
    - option "2027"
    - option "2028"
    - option "2029"
    - option "2030"
    - option "2031"
    - option "2032"
    - option "2033"
    - option "2034"
    - option "2035"
    - option "2036"
    - option "2037"
    - option "2038"
    - option "2039"
    - option "2040"
    - option "2041"
    - option "2042"
    - option "2043"
    - option "2044"
    - option "2045"
    - option "2046"
    - option "2047"
    - option "2048"
    - option "2049"
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { AppManager } from '../../pages/AppManager';
  3   | 
  4   | /**
  5   |  * PROJECT UI LIST PAGE — List View Functionality
  6   |  *
  7   |  * UI-only tests for the projects list page
  8   |  * Covers: Table columns, filters, sorting, search, pagination, navigation
  9   |  */
  10  | test.describe('Project Management: UI List Page @project @ui @smoke @regression @full', () => {
  11  | 
  12  |     async function setup(page: any) {
  13  |         const app = new AppManager(page);
  14  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  15  |         const meta = await app.api.project.discoverMetadataAPI();
  16  |         return { app, meta };
  17  |     }
  18  | 
  19  |     async function createProject(app: AppManager, meta: any, overrides: Record<string, any> = {}) {
  20  |         const name = `E2E-Project-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
  21  |         const project = await app.api.project.createProjectAPI({
  22  |             name,
  23  |             customerId: meta.customerId,
  24  |             estimatedRevenue: 200000,
  25  |             estimatedExpense: 80000,
  26  |             ...overrides
  27  |         });
  28  |         return { project, name };
  29  |     }
  30  | 
  31  |     // ── UI: LIST PAGE ───────────────────────────────────────────────────────────
  32  | 
  33  |     test('UI-01: Projects list page loads with all key table columns', async ({ page }) => {
  34  |         const { app } = await setup(page);
  35  |         await page.goto('/project-management/projects');
  36  |         await page.waitForLoadState('domcontentloaded');
  37  |         // Scope to table header to avoid matching sidebar nav items (e.g. "Customers")
  38  |         const thead = page.locator('table thead, thead, [role="columnheader"]');
  39  |         for (const col of ['Project Name', 'Customer', 'Status', 'Budget', 'Tasks', 'Start Date', 'End Date']) {
  40  |             const inHeader = thead.getByText(col, { exact: false }).first();
  41  |             const inPage = page.getByText(col, { exact: true }).first();
  42  |             const visible =
  43  |                 await inHeader.isVisible({ timeout: 8000 }).catch(() => false) ||
  44  |                 await inPage.isVisible({ timeout: 3000 }).catch(() => false);
> 45  |             expect(visible, `Column "${col}" not visible`).toBe(true);
      |                                                            ^ Error: Column "Project Name" not visible
  46  |         }
  47  |     });
  48  | 
  49  |     test('UI-02: Filter pills (Workspace, Workflow, Status, Budget) are visible', async ({ page }) => {
  50  |         const { app } = await setup(page);
  51  |         await page.goto('/project-management/projects');
  52  |         await page.waitForLoadState('domcontentloaded');
  53  |         for (const pill of ['Workspace', 'Workflow', 'Status', 'Budget']) {
  54  |             await expect(page.getByRole('button', { name: new RegExp(pill, 'i') }).first()).toBeVisible({ timeout: 8000 });
  55  |         }
  56  |     });
  57  | 
  58  |     test('UI-03: Sort and View buttons are visible in toolbar', async ({ page }) => {
  59  |         const { app } = await setup(page);
  60  |         await page.goto('/project-management/projects');
  61  |         await page.waitForLoadState('domcontentloaded');
  62  |         await expect(page.getByRole('button', { name: /Sort/i }).first()).toBeVisible({ timeout: 8000 });
  63  |         const viewBtn = page.getByRole('button', { name: /View/i }).first();
  64  |         const viewVisible = await viewBtn.isVisible({ timeout: 5000 }).catch(() => false);
  65  |         if (!viewVisible) console.log('[INFO] View button not present in toolbar — UI may have changed layout');
  66  |         else await expect(viewBtn).toBeVisible();
  67  |         console.log('[PASS] Toolbar controls verified');
  68  |     });
  69  | 
  70  |     test('UI-04: Advanced filters and Command filters links are present', async ({ page }) => {
  71  |         const { app } = await setup(page);
  72  |         await page.goto('/project-management/projects');
  73  |         await page.waitForLoadState('domcontentloaded');
  74  |         await expect(page.getByText(/Advanced filters/i).first()).toBeVisible({ timeout: 8000 });
  75  |         await expect(page.getByText(/Command filters/i).first()).toBeVisible({ timeout: 8000 });
  76  |     });
  77  | 
  78  |     test('UI-05: Add Project button and Export button are visible', async ({ page }) => {
  79  |         const { app } = await setup(page);
  80  |         await page.goto('/project-management/projects');
  81  |         await page.waitForLoadState('domcontentloaded');
  82  |         const addProjectEl = page.getByRole('link', { name: /Add Project/i }).or(page.getByRole('button', { name: /Add Project/i })).first();
  83  |         await expect(addProjectEl).toBeVisible({ timeout: 8000 });
  84  |         await expect(page.getByRole('button', { name: /Export/i })).toBeVisible({ timeout: 8000 });
  85  |     });
  86  | 
  87  |     test('UI-06: Search input is present and accepts text', async ({ page }) => {
  88  |         const { app } = await setup(page);
  89  |         await page.goto('/project-management/projects');
  90  |         await page.waitForLoadState('domcontentloaded');
  91  |         const search = page.getByPlaceholder(/Search/i).first();
  92  |         await expect(search).toBeVisible({ timeout: 8000 });
  93  |         await search.fill('test');
  94  |         await page.waitForTimeout(1000);
  95  |         await search.clear();
  96  |     });
  97  | 
  98  |     test('UI-07: Pagination shows rows-per-page and page count', async ({ page }) => {
  99  |         const { app } = await setup(page);
  100 |         await page.goto('/project-management/projects');
  101 |         await page.waitForLoadState('domcontentloaded');
  102 |         await expect(page.getByText(/Rows per page/i).first()).toBeVisible({ timeout: 8000 });
  103 |         await expect(page.getByText(/Page [0-9]+ of [0-9]+/i).first()).toBeVisible({ timeout: 8000 });
  104 |     });
  105 | 
  106 |     test('UI-08: Project created via API appears in the list', async ({ page }) => {
  107 |         const { app, meta } = await setup(page);
  108 |         const { project } = await createProject(app, meta);
  109 |         await page.goto('/project-management/projects');
  110 |         await page.waitForLoadState('domcontentloaded');
  111 |         await expect(page.getByText(project.ref, { exact: false }).first()).toBeVisible({ timeout: 15000 });
  112 |     });
  113 | 
  114 |     test('UI-09: Clicking project row navigates to detail view', async ({ page }) => {
  115 |         const { app, meta } = await setup(page);
  116 |         const { project } = await createProject(app, meta);
  117 |         await page.goto('/project-management/projects');
  118 |         await page.waitForLoadState('domcontentloaded');
  119 |         await page.getByText(project.ref, { exact: false }).first().click();
  120 |         await page.waitForLoadState('domcontentloaded');
  121 |         expect(page.url()).toContain('project');
  122 |         await expect(page.getByText(project.ref, { exact: false }).first()).toBeVisible({ timeout: 10000 });
  123 |     });
  124 | });
  125 | 
```