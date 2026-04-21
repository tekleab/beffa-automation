# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - img [ref=e5]
    - generic [ref=e10]:
      - heading "404 Not Found!" [level=1] [ref=e11]
      - paragraph [ref=e12]: The page you are looking for doesn't exist or has been moved. But you can go back to the previous page or go home.
    - group [ref=e13]:
      - button "Go back" [ref=e14] [cursor=pointer]:
        - img [ref=e16]
        - text: Go back
      - link "Go home" [ref=e19] [cursor=pointer]:
        - /url: /
        - img [ref=e21]
        - text: Go home
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