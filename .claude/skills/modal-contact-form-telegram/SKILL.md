---
name: Modal Contact Form with Telegram Integration
description: Global modal dialog with contact form (name, phone, message) that submits via Next.js Route Handler to Telegram Bot API. Covers modal state management, native dialog accessibility, react-hook-form + zod validation, and server-side secret handling.
topics: modal, dialog, telegram-bot-api, react-hook-form, zod, next.js-app-router, accessibility, forms
created: 2026-04-19
updated: 2026-04-19
scratchpad: .specs/scratchpad/e0d4f3f9.md
---

# Modal Contact Form with Telegram Integration

## Overview

A globally-accessible modal dialog containing a contact form (name, phone, optional message). CTA buttons anywhere in the app trigger it via a React Context. On submit, a Next.js Route Handler calls the Telegram Bot API — bot credentials live only in server-side env vars and never reach the browser.

This project has Next.js 16.2.4, React 19.2.4, react-hook-form 7.72.1, @hookform/resolvers 5.2.2, and zod 4.3.6 already installed. No new dependencies are needed.

---

## Key Concepts

- **ModalProvider**: `'use client'` Context provider in root layout; exposes `openModal()` and `closeModal()` and renders the `<dialog>` element
- **Native `<dialog>` + showModal()**: browser handles Escape key, focus management, and inert backdrop — no focus-trap library required
- **Route Handler**: `app/api/contact/route.ts` — server-only POST endpoint; env vars accessed via `process.env` without `NEXT_PUBLIC_` prefix
- **Honeypot**: hidden text field; if non-empty on the server, return 200 OK silently without calling Telegram
- **HTML escaping**: escape `&` → `&amp;`, `<` → `&lt;`, `>` → `&gt;` in that order before inserting user text into Telegram messages

---

## Documentation & References

| Resource | Description | Link |
|----------|-------------|------|
| Next.js Route Handlers | Official docs for app/api route files | `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md` |
| Next.js Environment Variables | Server-only vs NEXT_PUBLIC_ behavior | `node_modules/next/dist/docs/01-app/02-guides/environment-variables.md` |
| Next.js Forms guide | Server Actions and form patterns | `node_modules/next/dist/docs/01-app/02-guides/forms.md` |
| Telegram Bot API | sendMessage endpoint and parse_mode | https://core.telegram.org/bots/api#sendmessage |
| Telegram HTML formatting | Characters to escape in HTML mode | https://core.telegram.org/bots/api#html-style |
| MDN dialog element | showModal(), focus, Escape, aria | https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog |
| react-hook-form docs | useForm, register, formState | https://react-hook-form.com/docs/useform |
| Zod v4 changelog | Breaking changes from v3 | https://zod.dev/v4/changelog |

---

## Project Stack Versions (verified from node_modules)

| Package | Version |
|---------|---------|
| next | 16.2.4 |
| react | 19.2.4 |
| react-hook-form | 7.72.1 |
| @hookform/resolvers | 5.2.2 |
| zod | 4.3.6 |
| tailwindcss | ^4 |

---

## CTA Button Locations (all 7 confirmed by code inspection)

| File | Count | Current href |
|------|-------|-------------|
| `components/layout/site-header.tsx` | 2 | `/#contact` |
| `components/hero/hero-section.tsx` | 1 | `/#contact` |
| `components/services/service-detail-page.tsx` | 2 | `/#inquiry` |
| `app/about/page.tsx` | 1 | `/#inquiry` |
| `app/portfolio/[slug]/page.tsx` | 1 | `/#inquiry` |

All buttons use `<BrandButton>` from `components/ui/brand-button.tsx`. They must be converted to `as="button"` variant and call `openModal()` from context.

---

## Patterns & Best Practices

### Pattern 1: ModalProvider with Context

**When to use**: Any time a modal must be triggerable from multiple pages/components without prop-drilling.

**Key rules**:
- Mark provider `'use client'`
- Mount provider as close to root as possible but wrapping only `{children}` (not `<html>` or `<body>`) so Next.js can still optimize static parts
- Render the `<dialog>` element inside the provider, not via `createPortal` (dialog with showModal() already overlays correctly)

**Example**:
```tsx
'use client'
import { createContext, useCallback, useContext, useRef, useState } from 'react'

type ModalContextValue = { openModal: () => void }
const ModalContext = createContext<ModalContextValue>({ openModal: () => {} })

export function useModal() { return useContext(ModalContext) }

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  const openModal = useCallback(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal()
      setIsOpen(true)
    }
  }, [])

  const closeModal = useCallback(() => {
    dialogRef.current?.close()
    setIsOpen(false)
  }, [])

  return (
    <ModalContext.Provider value={{ openModal }}>
      {children}
      <dialog
        ref={dialogRef}
        aria-labelledby="contact-modal-title"
        aria-modal="true"
        onClose={() => setIsOpen(false)}
        onClick={(e) => { if (e.target === dialogRef.current) closeModal() }}
        className="..."
      >
        {isOpen && <ContactForm onClose={closeModal} />}
      </dialog>
    </ModalContext.Provider>
  )
}
```

**Note on React Strict Mode**: Guard `showModal()` with `!dialogRef.current?.open` to prevent the double-invocation error.

### Pattern 2: Native dialog Accessibility

**When to use**: Always — prefer native `<dialog>` over div-based portals.

**Browser behavior with showModal()**:
- Escape key closes dialog natively (fire `onCancel` / `onClose` events)
- Page content is made inert (no keyboard/screen-reader access outside)
- Implicit `role="dialog"` and `aria-modal="true"` (still add explicitly for older AT)
- Focus moves to first focusable child; add `autofocus` to the name field for explicit control

**Still required manually**:
- `aria-labelledby` pointing to the dialog's heading id
- Backdrop click: `onClick` on `<dialog>` checking `e.target === dialogRef.current`
- Return focus to the triggering CTA button on close (store ref to opener, call `.focus()` in onClose)

**Do NOT** toggle the `open` HTML attribute directly in React — always use `showModal()` / `close()` imperatively via a ref.

### Pattern 3: react-hook-form 7 + zod 4 Form

**When to use**: Client-side validation with TypeScript type safety, loading state, and field-level errors.

**Zod 4 notes**:
- `.min()`, `.regex()`, `.refine()` are unchanged from v3
- Error customization: `{ error: 'message' }` (the old `message` option is deprecated but functional)
- `z.string().email()` is deprecated — use `z.email()` — but for phone, use `.refine()` not built-in validators

**Example schema**:
```ts
import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(1, { error: 'Укажите имя' }).max(100),
  phone: z.string()
    .min(1, { error: 'Укажите телефон' })
    .refine(
      (val) => val.replace(/\D/g, '').length >= 10,
      { error: 'Введите корректный номер телефона' }
    ),
  message: z.string().max(1000).optional(),
  website: z.string().optional(), // honeypot — must be empty
})

export type ContactFormData = z.infer<typeof contactSchema>
```

**Example form hook setup**:
```tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema, type ContactFormData } from './contact-schema'

const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setError } =
  useForm<ContactFormData>({ resolver: zodResolver(contactSchema) })

const onSubmit = async (data: ContactFormData) => {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    setError('root', { message: 'Не удалось отправить заявку. Попробуйте ещё раз.' })
    return
  }
  // show success state
}
```

**Loading state**: `isSubmitting` is `true` during the async submit handler — no extra state variable needed. Disable inputs and submit button while it is true.

### Pattern 4: Route Handler for Telegram

**When to use**: Calling external APIs with server-side secrets from a client-triggered form.

**File**: `app/api/contact/route.ts`

**Key implementation points**:
- Access `process.env.TELEGRAM_BOT_TOKEN` and `process.env.TELEGRAM_CHAT_ID` — never prefix with `NEXT_PUBLIC_`
- Validate request body with zod (same schema or a subset)
- Check honeypot field first; if non-empty, return `Response.json({ ok: true })` immediately
- Escape HTML before formatting the Telegram message
- Log Telegram API errors without logging the token value
- Use `fetch` with an AbortController timeout (~8 seconds)

**HTML escaping for Telegram parse_mode HTML**:
```ts
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')  // must be first
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
```

**Telegram sendMessage call**:
```ts
const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`
const body = {
  chat_id: process.env.TELEGRAM_CHAT_ID,
  parse_mode: 'HTML',
  text: formatMessage(name, phone, message),
}
const tgRes = await fetch(telegramUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
  signal: AbortSignal.timeout(8000),
})
if (!tgRes.ok) {
  const err = await tgRes.json()
  console.error('Telegram API error:', err.error_code, err.description) // no token in log
  return Response.json({ ok: false }, { status: 502 })
}
```

**Telegram message format** (HTML, with Moscow timestamp):
```ts
function formatMessage(name: string, phone: string, message?: string): string {
  const now = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })
  const lines = [
    `<b>Новая заявка с сайта</b>`,
    `<b>Имя:</b> ${escapeHtml(name)}`,
    `<b>Телефон:</b> ${escapeHtml(phone)}`,
    message ? `<b>Сообщение:</b> ${escapeHtml(message)}` : null,
    `<b>Получено:</b> ${now} МСК`,
  ].filter(Boolean)
  return lines.join('\n')
}
```

---

## Design Tokens (from globals.css)

| Token | Value | Usage |
|-------|-------|-------|
| `bg-background` | `#06070a` | dialog/page background |
| `bg-surface-raised` | `#14171e` | dialog panel background |
| `border-border` | `#1f232c` | dialog border |
| `text-foreground` | `#e9ecf2` | primary text |
| `text-subtle` | `#606776` | label text |
| `text-brand` | `#ff5a1f` | brand accent, focus ring |
| `bg-brand` | `#ff5a1f` | submit button |
| `bg-brand-hover` | `#ff7944` | submit button hover |

Use `cn()` from `@/lib/class-merger` (re-export of clsx + tailwind-merge).

---

## UX States

| State | Behavior |
|-------|----------|
| `idle` | Form with name, phone, message, submit button |
| `loading` (isSubmitting) | All inputs `disabled`, button shows spinner, no re-submission |
| `success` | Success message shown; auto-close after 3 s with `setTimeout` |
| `error` | Error message with phone `tel:` link shown; form data preserved; button re-enabled |

---

## Common Pitfalls & Solutions

| Issue | Impact | Solution |
|-------|--------|----------|
| Calling showModal() twice in React StrictMode | Error thrown | Guard with `if (!dialogRef.current?.open)` |
| Toggling `open` attribute directly | Dialog not accessible | Always use `.showModal()` / `.close()` imperatively |
| Putting token in NEXT_PUBLIC_ env var | Token exposed in JS bundle | Never use NEXT_PUBLIC_ for secrets; access only in route.ts |
| Not escaping & first in Telegram HTML | Double-encoding corruption | Always replace `&` before `<` and `>` |
| Missing aria-labelledby | Screen readers don't announce dialog title | Add `aria-labelledby="dialog-title-id"` on `<dialog>` |
| Focus not returned after close | Keyboard users lost | Store opener ref before showModal(); call `.focus()` on close |
| isSubmitting not clearing on error | Button permanently disabled | setError() clears isSubmitting; alternatively manage status with useState |

---

## Environment Variables

```bash
# .env.local (not committed — add to .gitignore)
TELEGRAM_BOT_TOKEN=1234567890:ABCDefghIJKlmnoPQRstuvwXYZ
TELEGRAM_CHAT_ID=-1001234567890

# .env.example (committed — template for new developers)
# Telegram Bot API token — get from @BotFather
TELEGRAM_BOT_TOKEN=

# Telegram chat/group ID where leads are sent
TELEGRAM_CHAT_ID=
```

**VPS deployment**: Set both variables in the PM2 ecosystem config or via `pm2 set` / server environment before running `npm run build && pm2 restart printscan-site`.

---

## Recommendations

1. **ModalProvider placement**: Add inside `<body>` in `app/layout.tsx`, wrapping only `{children}` (not the entire `<html>` tree) to preserve Next.js static optimization
2. **CTA button conversion**: Wrap each CTA location in a thin `'use client'` component that calls `useModal().openModal()` — keep the visual `BrandButton` component unchanged
3. **Schema sharing**: Define the zod schema once in `lib/contact-schema.ts` and import it in both the client form and the server route handler for consistent validation
4. **Honeypot field**: Style it with `position: absolute; opacity: 0; height: 0; pointer-events: none` — do not use `display: none` or `visibility: hidden` as some bots detect those
5. **Timeout on Telegram fetch**: Use `AbortSignal.timeout(8000)` (Node 18+ / available in Next.js 16) to prevent the route handler hanging indefinitely

---

## Sources & Verification

| Source | Type | Last Verified |
|--------|------|---------------|
| `node_modules/next/dist/docs/01-app/` (route.md, forms.md, environment-variables.md) | Official — Next.js 16.2.4 | 2026-04-19 |
| https://core.telegram.org/bots/api | Official — Telegram | 2026-04-19 |
| https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog | Official — MDN | 2026-04-19 |
| https://zod.dev/v4/changelog | Official — Zod | 2026-04-19 |
| Package versions from node_modules | Direct inspection | 2026-04-19 |

---

## Changelog

| Date | Changes |
|------|---------|
| 2026-04-19 | Initial creation for task: Модальная форма заявки с отправкой в Telegram |
