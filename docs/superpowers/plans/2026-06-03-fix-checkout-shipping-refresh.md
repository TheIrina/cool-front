# Fix Checkout Shipping and Payment Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolve the checkout issue where selecting a shipping method doesn't activate the "Continuar al pago" button or update the cart pricing totals by bypassing the Next.js cache for cart retrieval.

**Architecture:** Change the cart retrieval fetching behavior in `retrieveCart` from `cache: "force-cache"` to `cache: "no-store"`. Because the cart is highly dynamic, caching it causes stale views. Disabling caching ensures that when the checkout server component re-runs (triggered by `router.refresh()`), it fetches the live cart containing the new shipping methods and updated pricing.

**Tech Stack:** Next.js App Router, React, MedusaJS

---

### Task 1: Update retrieveCart to Disable Cache

**Files:**
- Modify: [cart.ts](file:///Users/santiago/proyectos/eme-sport-wear/src/lib/data/cart.ts)

- [ ] **Step 1: Replace cache: "force-cache" with cache: "no-store" in retrieveCart**

Modify `retrieveCart` in [cart.ts](file:///Users/santiago/proyectos/eme-sport-wear/src/lib/data/cart.ts) to disable caching.

Modify [cart.ts](file:///Users/santiago/proyectos/eme-sport-wear/src/lib/data/cart.ts) around line 47:
```typescript
  return await sdk.client
    .fetch<HttpTypes.StoreCartResponse>(`/store/carts/${id}`, {
      method: "GET",
      query: {
        fields
      },
      headers,
      next,
      cache: "no-store",
    })
```

---

### Task 2: Code Validation and Build Verification

**Files:**
- Modify: None

- [ ] **Step 1: Run format and lint checks**

Run: `bun run lint` and `bun run format:check` to ensure the changes meet project coding standards.
Expected: Exit code 0 (excluding pre-existing lint errors in unrelated files).

- [ ] **Step 2: Run local production build**

Run: `bun run build`
Expected: Next.js build finishes successfully without any compilation errors.
