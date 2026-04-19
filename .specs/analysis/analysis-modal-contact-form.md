---
title: Codebase Impact Analysis - Модальная форма заявки с отправкой в Telegram
task_file: /Users/rappsix/printscan_site/.specs/tasks/draft/modal-contact-form.feature.md
scratchpad: /Users/rappsix/printscan_site/.specs/scratchpad/53fc59f2.md
created: 2026-04-19
status: complete
---

# Codebase Impact Analysis: Модальная форма заявки с отправкой в Telegram

## Summary

- **Files to Modify**: 6 files
- **Files to Create**: 4 files (+ .env.local)
- **Files to Delete**: 0
- **Test Files Affected**: 0 (no tests exist)
- **Risk Level**: Low

---

## All Buttons Found

Every button that must open the modal (7 total across 5 files):

| File | Line | Label | Current href | Component Context |
|------|------|-------|-------------|-------------------|
| `components/hero/hero-section.tsx` | 52 | Получить консультацию | `/#contact` | HeroSection ("use client") |
| `components/layout/site-header.tsx` | 52 | Оставить заявку | `/#contact` | SiteHeader desktop ("use client") |
| `components/layout/site-header.tsx` | 92 | Оставить заявку | `/#contact` | SiteHeader mobile menu ("use client") |
| `components/services/service-detail-page.tsx` | 58 | Оставить заявку | `/#inquiry` | ServiceHero (server component) |
| `components/services/service-detail-page.tsx` | 243 | Оставить заявку | `/#inquiry` | ServiceCta (server component) |
| `app/about/page.tsx` | 181 | Оставить заявку | `/#inquiry` | Inline CTA section (server component) |
| `app/portfolio/[slug]/page.tsx` | 102 | Оставить заявку | `/#inquiry` | Inline CTA section (server component) |

Note: `/#contact` and `/#inquiry` are dead anchors — no section on any page has these IDs. The modal replaces this broken navigation.

---

## Files to be Modified/Created

### New Files to Create

```
components/ui/
├── contact-modal.tsx              # NEW: Modal dialog UI with form (react-hook-form + zod)
├── contact-modal-provider.tsx     # NEW: React context, open/close state, mounts modal
└── open-modal-button.tsx          # NEW: Client wrapper around BrandButton calling context

app/api/contact/
└── route.ts                       # NEW: POST handler — validates body, sends to Telegram Bot API

.env.local                         # NEW: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID (gitignored)
```

### Modified Files

```
app/
└── layout.tsx                     # UPDATE: Wrap {children} with <ContactModalProvider>

components/
├── hero/
│   └── hero-section.tsx           # UPDATE: Replace BrandButton href="/#contact" at L52
├── layout/
│   └── site-header.tsx            # UPDATE: Replace 2x BrandButton href="/#contact" at L52, L92
└── services/
    └── service-detail-page.tsx    # UPDATE: Replace 2x BrandButton href="/#inquiry" at L58, L243

app/
├── about/
│   └── page.tsx                   # UPDATE: Replace BrandButton href="/#inquiry" at L181
└── portfolio/
    └── [slug]/
        └── page.tsx               # UPDATE: Replace BrandButton href="/#inquiry" at L102
```

---

## Key Interfaces & Contracts

### BrandButton (existing — no changes needed)

File: `components/ui/brand-button.tsx:37`

Already supports `as="button"` with full `ButtonHTMLAttributes` spread. `onClick` is available via this path. All current CTAs use the `href` form and must be converted.

### OpenModalButton (new)

```ts
OpenModalButton(props: {
  variant?: "primary" | "ghost" | "outline"
  className?: string
  children: ReactNode
}): JSX.Element
// Reads openContactModal from context, renders BrandButton as="button"
```

### ContactModalContext (new)

```ts
interface ContactModalContextValue {
  openContactModal: () => void
  closeContactModal: () => void
}
```

### Contact Form Schema (new — zod)

```ts
ContactFormSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  message: z.string().optional(),
})
type ContactFormData = z.infer<typeof ContactFormSchema>
```

### API Route Contract (new)

```
POST /api/contact
Body: { name: string; phone: string; message?: string }
Response 200: { ok: true }
Response 400: { error: string }
Response 500: { error: string }
```

---

## Architecture Decision: Context Provider Pattern

The modal must be triggered from both server components (about, portfolio, service-detail) and existing client components (hero, header). The correct Next.js App Router pattern:

1. `ContactModalProvider` ("use client") wraps `{children}` in `app/layout.tsx:74`
2. React context carries `openContactModal` function
3. `OpenModalButton` ("use client") is a client leaf node — server components import and render it safely
4. The `<ContactModal>` is mounted once inside the provider, not per page

This avoids duplicating modal state and DOM node across pages.

---

## Integration Points

| File | Relationship | Impact | Action Needed |
|------|--------------|--------|---------------|
| `app/layout.tsx:74` | Renders `{children}` — add provider wrapper | High | Import + wrap |
| `components/ui/brand-button.tsx` | Used by OpenModalButton via `as="button"` | Low | No change |
| `lib/class-merger.ts` | `cn()` used by modal for conditional classes | Low | None |
| `.env.local` (new) | Read by API route at runtime | High | Create on local dev AND on VPS at `/var/www/printscan-site/.env.local` |

---

## Installed Libraries Available

| Library | Version | Use in Feature |
|---------|---------|----------------|
| `react-hook-form` | ^7.72.1 | Form state management in contact-modal.tsx |
| `@hookform/resolvers` | ^5.2.2 | Zod resolver for react-hook-form |
| `zod` | ^4.3.6 | Schema validation in modal + API route |
| `lucide-react` | ^1.8.0 | X icon for modal close button |

No modal library is installed — implement with a fixed overlay div + createPortal or simple fixed positioning.

---

## Design Tokens to Use in Modal

| Token | Purpose |
|-------|---------|
| `bg-background/80 backdrop-blur-sm` | Overlay backdrop |
| `bg-surface-raised` | Modal panel background |
| `border-border` | Modal panel border |
| `rounded-2xl` | Modal panel corner radius |
| `text-foreground` | Headings and labels |
| `text-muted` | Helper text |
| `text-brand` | Accent, required markers |
| `focus-visible:ring-brand/60 focus-visible:ring-2` | Input focus ring (matches BrandButton) |

---

## Risk Assessment

| Area | Risk | Mitigation |
|------|------|------------|
| Context provider in layout | May seem to break RSC rendering | Correct in React 19 — RSC children passed as props still render server-side |
| service-detail-page.tsx (server) | Cannot call hooks in server component | Use `<OpenModalButton>` as client leaf — no hooks required in server file |
| `.env.local` on VPS | Missing env = 500 on form submit | Must create `/var/www/printscan-site/.env.local` on server after SSH deploy |
| No focus trap in modal | Accessibility issue | Add `autofocus` on first input + Escape key handler + click-outside close |
| Zod v4 minor API differences | Schema syntax changes from v3 | `z.string().min()` is identical in v4; safe |

---

## Recommended Reading Before Implementation

1. `components/ui/brand-button.tsx` — Discriminated union type; how `as="button"` unlocks onClick
2. `components/layout/site-header.tsx` — "use client" + useState pattern; exact lines to change (L52, L92)
3. `components/home/contact-form-section.tsx` — Design token reference for card/icon styling
4. `app/layout.tsx:61-79` — Where to insert ContactModalProvider wrapper

---

## Verification Summary

| Check | Status | Notes |
|-------|--------|-------|
| All affected files identified | done | 7 button instances across 6 files; 4 new files to create |
| Integration points mapped | done | layout.tsx wrapper, env vars on VPS |
| Similar patterns found | done | site-header.tsx for "use client"; brand-button for as="button" |
| Test coverage analyzed | done | No tests exist in this project |
| Risks assessed | done | RSC boundary and missing VPS env vars are the two key risks |

**Limitations**: `.env.local` is gitignored and does not exist. Values for `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` must be obtained from the client and added locally and on the VPS before end-to-end functionality works.
