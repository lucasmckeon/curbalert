# 🧠 Server Utilities – Internal Only

This folder contains server-only functions **that should NOT be marked with `'use server'`**.

- These are NOT server actions
- They are **not meant to be called from the client**
- Adding `'use server'` here would make them accidentally callable by form actions or useActionState, which we want to avoid

✅ Call these functions only from:

- Server components (`page.tsx`, `layout.tsx`)
- Other server functions
- Route handlers (`route.ts`)

❌ Do NOT pass these functions to forms or useActionState
