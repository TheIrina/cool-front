# Fix Checkout Input Labels Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the checkout input labels by resolving the negative z-index issue which makes the floating labels invisible behind the opaque input background.

**Architecture:** Update the `Input` component's label className in `src/modules/common/components/input/index.tsx`. Change `-z-1` to `z-10 pointer-events-none` so that the label renders on top of the input background, while still allowing pointer clicks to pass through to focus the underlying input field.

**Tech Stack:** Next.js, React, Tailwind CSS

---

### Task 1: Modify Input Component Label Classes

**Files:**
- Modify: `src/modules/common/components/input/index.tsx:50-60`

- [ ] **Step 1: Replace `-z-1` with `z-10 pointer-events-none` in `src/modules/common/components/input/index.tsx`**

We will update the `<label>` element's className to ensure it resides on a layer above the opaque input background and allows mouse clicks to interact directly with the input behind it.

Modify lines 51-58:
```tsx
          <label
            htmlFor={name}
            onClick={() => inputRef.current?.focus()}
            className="flex items-center justify-center mx-3 px-1 transition-all absolute duration-300 top-3 z-10 pointer-events-none origin-0 text-ui-fg-subtle"
          >
            {label}
            {required && <span className="text-rose-500">*</span>}
          </label>
```

- [ ] **Step 2: Commit the changes**

```bash
git add src/modules/common/components/input/index.tsx
git commit -m "style: fix floating label visibility by replacing -z-1 with z-10 pointer-events-none"
```

---

### Task 2: Lint and Verify the Code

**Files:**
- Modify: None

- [ ] **Step 1: Check formatting and linting rules**

Run: `bun run lint` and `bun run format:check` to ensure the codebase remains clean.
Expected: Exit code 0, no errors.

- [ ] **Step 2: Run a production build to check for compilation issues**

Run: `bun run build`
Expected: Next.js build succeeds with no TypeScript or component compilation errors.
