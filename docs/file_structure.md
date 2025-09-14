# Project Structure (Next.js )

```text
/app
  /(trivia)
    layout.tsx
    actions.ts                  # group-wide server actions ("use server")
    page.tsx # page to show at '/' unless custom rules dictate '/' page
    /buy-credits
      page.tsx                  # server component
      actions.ts
      BuyCreditsForm.tsx        # client component (ok to colocate)
      BuyCreditsForm.module.scss
      BuyCreditsForm.test.tsx

    /lobby
      page.tsx
      Lobby.tsx
      Lobby.module.scss
      Lobby.test.tsx
      lobby.schema.ts           # feature-local schema/types

/lib
  /components #Shared components
  /hooks # Shared hooks
  /actions # truly cross-domain server actions
    auth.ts
    users.ts
    email.ts
  /server # server only functions like getAllUsers
    user.ts

  /schemas # cross-domain reusable schemas, export types from here
    user.ts
    signal.ts

/styles # SCSS Modules, css, styling
  /base
  /components
  /utils
  index.scss # Consolidated files to be imported in root layout.tsx.

/tests
  /integration
    lobby-flow.test.tsx
  /e2e                          # (if/when you add Playwright/Cypress)
    auth.spec.ts
```
