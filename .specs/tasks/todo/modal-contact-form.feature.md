---
title: Модальная форма заявки с отправкой в Telegram
type: feature
---

# Модальная форма заявки с отправкой в Telegram

## Description

> **Required Skill**: You MUST use and analyse `modal-contact-form-telegram` skill before doing any modification to this task file or starting implementation of it!
>
> Skill location: `.claude/skills/modal-contact-form-telegram/SKILL.md`

Сегодня каждая CTA-кнопка "Получить консультацию" / "Оставить заявку" ведёт на якорь `#contact` или `#inquiry`, где находится только блок с контактными каналами (телефон, WhatsApp, Telegram, email, VK) — формы заявки на сайте нет. Чтобы оставить заявку, посетитель вынужден переключаться в стороннее приложение и вручную писать сообщение, что увеличивает отток в воронке и приводит к неструктурированным лидам без обязательных полей.

Решение — модальное окно с короткой формой (имя, телефон, опциональное сообщение), которое открывается из любой CTA-кнопки на сайте. После отправки данные уходят POST-запросом на серверный API-route, который форматирует сообщение и доставляет его в Telegram-чат команды через Bot API. Бот-токен и chat ID хранятся как серверные переменные окружения и никогда не попадают в клиентский бандл. Модалка соответствует тёмной теме сайта, валидируется на клиенте, показывает состояния загрузки/успеха/ошибки и закрывается по клику вне формы, по Escape и по кнопке закрытия.

Получают выгоду: посетители (меньше шагов, нет переключения между приложениями), отдел продаж / владелец (мгновенный пуш в существующий Telegram-чат с уже структурированными контактными данными), бизнес (рост конверсии без подключения CRM или email-инфраструктуры).

**Scope**:

- Included:
  - Единый модальный компонент формы (один источник правды).
  - Глобальный механизм открытия модалки, доступный со всех страниц.
  - Замена поведения 7 существующих CTA-кнопок ("Получить консультацию" / "Оставить заявку") в файлах: `components/hero/hero-section.tsx`, `components/services/service-detail-page.tsx` (×2), `components/layout/site-header.tsx` (×2), `app/about/page.tsx`, `app/portfolio/[slug]/page.tsx`.
  - Поля формы: имя (обязательно), телефон (обязательно), сообщение (опционально).
  - Клиентская и серверная валидация.
  - API-route `POST /api/contact`, отправляющий сообщение в Telegram через Bot API.
  - HTML-экранирование пользовательских значений в сообщении бота.
  - Состояния UX: idle, loading, success (с авто-закрытием через 3 секунды), error (с возможностью повторной отправки).
  - Закрытие модалки: кнопка X, клавиша Escape, клик по фону.
  - Hidden honeypot-поле для базовой защиты от ботов.
  - Документирование переменных окружения `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` в `.env.example`.
- Excluded:
  - Загрузка файлов / вложений.
  - CAPTCHA и расширенная защита от ботов (rate limiting, проверка IP).
  - Сохранение заявок в базу данных.
  - Email-резерв при недоступности Telegram.
  - UTM / отслеживание источника клика.
  - Цели Яндекс.Метрики на отправку (отдельная задача).
  - Многошаговый мастер.
  - Локализация (UI остаётся на русском).
  - Удаление существующего блока `ContactFormSection` с контактными каналами — он остаётся как альтернативный путь.

**User Scenarios**:

1. **Primary Flow**: Посетитель кликает любую CTA → открывается модалка → заполняет имя, телефон, опционально сообщение → жмёт "Отправить" → видит индикатор загрузки → в течение 2 секунд видит сообщение об успехе → модалка авто-закрывается через 3 секунды; команда получает структурированное сообщение в Telegram-чате.
2. **Alternative Flow**: Посетитель закрывает модалку (X / Escape / клик по фону) до отправки → модалка закрывается мгновенно, фокус возвращается на CTA-кнопку, ничего не отправляется.
3. **Error Handling**: При сбое сети, недоступности Telegram API или некорректной конфигурации сервера модалка показывает сообщение об ошибке с телефоном для прямой связи; данные формы сохраняются для повторной попытки. При невалидной форме (пустое имя/телефон, некорректный телефон) показываются inline-ошибки и фокус переходит на первое невалидное поле; запрос на сервер не отправляется.

## User Input

Добавить модальную форму заявки: кнопки "Получить консультацию" и "Оставить заявку" открывают модалку в стиле сайта, данные отправляются в Telegram бот через API route. Нужно: 1) найти все кнопки в проекте, 2) создать модальный компонент с формой, 3) создать API route для отправки в TG, 4) подключить кнопки к модалке.

## Context

- Сайт: Next.js (App Router), TypeScript, Tailwind CSS
- Стек: компоненты в `components/`, контент в `content/`, страницы в `app/`
- Уже есть: `components/ui/brand-button.tsx`, `components/home/contact-form-section.tsx`
- Кнопки "Получить консультацию" и "Оставить заявку" встречаются в нескольких местах на сайте
- Данные формы: имя, телефон, сообщение (опционально)
- Telegram bot token и chat_id нужно вынести в env переменные

---

## Acceptance Criteria

### Functional Requirements

- [ ] **CTA opens modal**: При клике на любую кнопку "Получить консультацию" или "Оставить заявку" (7 идентифицированных мест) модальное окно открывается в течение 100 мс и фокус переходит на первое поле формы.
  - Given: Посетитель находится на странице, содержащей CTA-кнопку
  - When: Посетитель кликает кнопку
  - Then: Модалка появляется в течение 100 мс, фокус — на первом поле

- [ ] **Required-field validation**: При попытке отправить форму с пустыми полями "имя" или "телефон" под соответствующим полем появляется inline-ошибка ("Укажите имя" / "Укажите телефон"), фокус переходит на первое невалидное поле, запрос на сервер не отправляется.
  - Given: Модалка открыта, обязательные поля пусты
  - When: Посетитель кликает "Отправить"
  - Then: Появляются inline-ошибки, фокус — на первом невалидном поле, сетевой запрос НЕ выполняется

- [ ] **Phone format validation**: При вводе значения, не похожего на номер телефона (менее 10 цифр или содержит недопустимые символы), и попытке отправки появляется inline-ошибка "Введите корректный номер телефона", запрос на сервер не отправляется.
  - Given: Модалка открыта, поле "телефон" содержит недопустимое значение
  - When: Посетитель кликает "Отправить"
  - Then: Под полем появляется ошибка формата, сетевой запрос НЕ выполняется

- [ ] **Successful submission delivers Telegram message**: При корректно заполненной форме и валидной конфигурации в течение 2 секунд модалка переходит в состояние успеха, а в настроенный Telegram-чат приходит сообщение с подписанными полями.
  - Given: `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` валидны; форма корректно заполнена
  - When: Посетитель кликает "Отправить"
  - Then: В течение 2 секунд показывается сообщение "Заявка отправлена! Мы свяжемся в течение рабочего дня."; в Telegram-чате появляется сообщение с полями: Имя, Телефон, Сообщение (если заполнено), Получено (timestamp в МСК)

- [ ] **Loading state during submission**: После клика "Отправить" кнопка показывает индикатор загрузки и становится недоступной, поля формы блокируются, повторная отправка невозможна до получения ответа.
  - Given: Модалка открыта с валидной формой
  - When: Посетитель кликает "Отправить"
  - Then: Кнопка отображает спиннер и становится disabled, поля становятся disabled, второй клик не вызывает повторного запроса

- [ ] **Error state on failure**: При сетевой ошибке, недоступности Telegram API или ошибке сервера модалка показывает сообщение об ошибке с телефоном-ссылкой; данные формы сохраняются; кнопка "Отправить" снова доступна.
  - Given: Telegram API недоступен ИЛИ сеть нестабильна ИЛИ env-переменные не настроены
  - When: Посетитель отправляет валидную форму
  - Then: Модалка показывает "Не удалось отправить заявку. Попробуйте ещё раз или позвоните: <телефон>" с `tel:`-ссылкой; данные формы сохранены; кнопка снова активна

- [ ] **Close on Escape**: При нажатии Escape, когда модалка открыта, она закрывается в течение 100 мс и фокус возвращается на CTA-кнопку, открывшую модалку.
  - Given: Модалка открыта, фокус внутри неё
  - When: Посетитель нажимает Escape
  - Then: Модалка закрывается в течение 100 мс; фокус возвращается на CTA-кнопку

- [ ] **Close on backdrop click**: Клик по затемнённой области вне диалога закрывает модалку; клик внутри диалога её НЕ закрывает.
  - Given: Модалка открыта
  - When: Посетитель кликает по затемнённой области вне диалога
  - Then: Модалка закрывается; клик ВНУТРИ диалога не вызывает закрытия

- [ ] **Close on X button**: Клик по кнопке закрытия (X) внутри модалки закрывает её и возвращает фокус на CTA-кнопку.
  - Given: Модалка открыта
  - When: Посетитель кликает по кнопке закрытия
  - Then: Модалка закрывается в течение 100 мс; фокус возвращается на CTA-кнопку

- [ ] **Success view auto-closes**: Через 3 секунды после показа сообщения об успехе модалка закрывается автоматически и фокус возвращается на CTA-кнопку.
  - Given: Модалка показывает сообщение об успехе
  - When: Прошло 3 секунды без действий пользователя
  - Then: Модалка закрывается автоматически; фокус возвращается на CTA-кнопку

- [ ] **HTML escaping in Telegram message**: Если посетитель отправляет форму со значением `<b>Test</b>` в имени, сообщение в Telegram отображает текст буквально, а не как форматированный HTML.
  - Given: Посетитель ввёл `<b>Test</b>` в поле имени
  - When: Форма успешно отправлена
  - Then: В Telegram сообщение содержит текст `<b>Test</b>` без форматирования (теги отображаются как символы)

- [ ] **Server-only secrets**: Значение TELEGRAM_BOT_TOKEN отсутствует в любом HTML-документе или JavaScript-файле, который браузер получает с сервера.
  - Given: Приложение собрано в production-режиме
  - When: Производится поиск значения токена в содержимом ответов на запросы браузера
  - Then: Токен не найден ни в одном HTML или JavaScript ответе

- [ ] **Documented env vars**: Файл `.env.example` содержит обе переменные `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` с краткими комментариями.
  - Given: Свежий клон репозитория
  - When: Разработчик открывает `.env.example`
  - Then: Обе переменные присутствуют с пояснениями назначения

- [ ] **Keyboard-accessible modal**: При открытой модалке последовательное нажатие Tab перемещает фокус по элементам внутри диалога, не выходя за его пределы.
  - Given: Модалка открыта
  - When: Посетитель повторно нажимает Tab (или Shift+Tab)
  - Then: Фокус циклически перемещается по элементам внутри диалога (поля, "Отправить", "Закрыть") и не выходит за его пределы

- [ ] **Honeypot drops bot submissions**: Если скрытое поле-ловушка содержит значение, сервер возвращает 200 OK, но сообщение в Telegram НЕ отправляется.
  - Given: Скрытое honeypot-поле заполнено любым значением
  - When: Форма отправлена
  - Then: Сервер возвращает 200 OK; сообщение в Telegram-чат не приходит

### Non-Functional Requirements

- [ ] **Performance**: Сабмит формы доходит до состояния success или error в пределах 2 секунд p95 на стандартном широкополосном соединении.
- [ ] **Security**: Все пользовательские значения HTML-экранируются перед вставкой в сообщение Telegram; секреты не префиксуются `NEXT_PUBLIC_`; `.env.local` присутствует в `.gitignore`.
- [ ] **Accessibility**: Диалог имеет `role="dialog"`, `aria-modal="true"`, доступный заголовок; статус-сообщения объявляются через `aria-live="polite"`; все элементы управления доступны с клавиатуры.
- [ ] **Compatibility**: Модалка корректно отображается и работает в последних 2 мажорных версиях Chrome, Safari, Firefox на десктопе и мобильных устройствах (iOS Safari, Android Chrome) при ширине вьюпорта от 320 до 1920 пикселей.
- [ ] **Reliability**: Сервер логирует ошибки Telegram API (статус и описание), не выводя в лог сам токен; не падает при сбое внешнего API.

### Definition of Done

- [ ] Все acceptance criteria выполнены и проверены вручную.
- [ ] `.env.example` обновлён с новыми переменными.
- [ ] Все 7 CTA-кнопок переключены на открытие модалки.
- [ ] Сборка проекта (`npm run build`) проходит без ошибок и предупреждений TypeScript / ESLint.
- [ ] Производственный деплой требует установки переменных окружения на VPS — это задокументировано в комментарии PR/коммита.

---

## Architecture Overview

### References

- **Skill**: `/Users/rappsix/printscan_site/.claude/skills/modal-contact-form-telegram/SKILL.md`
- **Codebase Analysis**: `/Users/rappsix/printscan_site/.specs/analysis/analysis-modal-contact-form.md`
- **Scratchpad**: `/Users/rappsix/printscan_site/.specs/scratchpad/8d46a1bc.md`

### Solution Strategy

**Approach**: A single `ContactModalProvider` (client component) is mounted once in `app/layout.tsx`, wrapping the `SiteHeader`, `<main>{children}</main>`, and `SiteFooter`. It exposes `openContactModal()` and `closeContactModal()` via React Context and renders exactly one native `<dialog>` element. The dialog is opened imperatively through a ref using `showModal()` / `close()` — the browser handles focus trap, Escape key, and inert backdrop, so no focus-trap library is needed. A thin client leaf `OpenContactModalButton` wraps the existing `BrandButton` with `as="button"` and calls the context; it is safe to render from both server components and client components, so the 7 CTAs can be swapped without converting server pages to `"use client"`. The form uses react-hook-form 7 + zod 4 (already installed) with a schema shared between the client and the `POST /api/contact` Route Handler. The handler validates input, short-circuits the honeypot field, delegates to a `telegramLeadNotifier` adapter that HTML-escapes user input and calls the Telegram Bot API with an 8-second `AbortSignal.timeout`. Credentials live only in server env vars (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`) — no `NEXT_PUBLIC_` prefix, so they never reach the browser bundle.

**Architecture Pattern**: Layered + Hexagonal (Ports & Adapters) hybrid — Presentation (modal UI + trigger) → Application (Route Handler + shared zod schema) → Infrastructure (Telegram adapter). Chosen because the codebase already follows a layered style (pages → feature components → UI primitives → lib) and this feature introduces exactly one external integration (Telegram) that benefits from being behind a replaceable port.

**Bounded Context**: `lead-capture`. Ubiquitous language: *lead / заявка, contact, honeypot, notifier*. All new files live in `components/lead-capture/` and `lib/lead-capture/` — no generic `utils`/`helpers`/`shared` modules.

**Key Decisions**:

1. **ModalProvider Context + native `<dialog>`** — single DOM node, server-component-compatible, native a11y, zero new dependencies.
2. **Route Handler, not Server Action** — matches the task's `POST /api/contact` contract and enables curl-based server testing.
3. **Shared zod schema** in `lib/lead-capture/contact-lead-schema.ts` — one source of truth for client and server validation, no drift.
4. **Telegram adapter isolated** in `lib/lead-capture/telegram-lead-notifier.ts` — future delivery channels (email, CRM) replace this module without touching UI or schema.
5. **BrandButton unchanged** — `OpenContactModalButton` is a thin client wrapper; the visual primitive is reused as `as="button"`.

**Trade-offs Accepted**:

- Accepting a small amount of Route Handler boilerplate in exchange for an explicit, testable HTTP boundary (vs Server Actions).
- Accepting one `"use client"` provider in the layout subtree in exchange for letting all server pages render CTAs without adopting `"use client"` themselves.
- Accepting manual opener-focus restoration (store ref before `showModal()`, call `.focus()` on close) in exchange for not introducing a focus-trap library.

---

### Architecture Decomposition

| Component | File | Layer | Responsibility | Key Dependencies |
|-----------|------|-------|----------------|------------------|
| `ContactModalProvider` | `components/lead-capture/contact-modal-provider.tsx` | Presentation (client) | Holds open state + opener ref; exposes context; mounts single `ContactModal` | React, `ContactModal` |
| `useContactModal` | same file | Presentation (client) | Hook reading the context; throws outside provider | React Context |
| `ContactModal` | `components/lead-capture/contact-modal.tsx` | Presentation (client) | Renders `<dialog>`; calls `showModal()`/`close()` via ref; backdrop-click + Escape handling; restores opener focus on close | `ContactForm`, `lucide-react` (X icon), `cn` |
| `ContactForm` | `components/lead-capture/contact-form.tsx` | Presentation (client) | react-hook-form + zod form; fields, honeypot, status views (idle/loading/success/error); calls `submitContactLead` | `contactLeadSchema`, `submitContactLead`, `react-hook-form`, `@hookform/resolvers/zod` |
| `OpenContactModalButton` | `components/lead-capture/open-contact-modal-button.tsx` | Presentation (client leaf) | Renders `BrandButton as="button"`; on click calls `openContactModal(ref.current)`; safe import from server components | `useContactModal`, `BrandButton` |
| `contactLeadSchema` | `lib/lead-capture/contact-lead-schema.ts` | Domain (shared) | Zod schema + `ContactLead` type; used by client form and server route | `zod` |
| `submitContactLead` | `lib/lead-capture/submit-contact-lead.ts` | Application (client) | Browser-side POST to `/api/contact`; returns typed result | `fetch` |
| `POST /api/contact` | `app/api/contact/route.ts` | Application (server) | Parses body, validates, short-circuits honeypot, delegates to notifier, maps errors to HTTP status | `contactLeadSchema`, `telegramLeadNotifier` |
| `telegramLeadNotifier` | `lib/lead-capture/telegram-lead-notifier.ts` | Infrastructure (server) | Builds HTML-escaped message, calls Telegram `sendMessage` with 8s timeout, logs errors without token | `formatLeadMessage`, `fetch` |
| `formatLeadMessage` | `lib/lead-capture/format-lead-message.ts` | Infrastructure (server) | Formats multiline HTML message with Moscow timestamp | `escapeTelegramHtml` |
| `escapeTelegramHtml` | `lib/lead-capture/escape-telegram-html.ts` | Infrastructure (server) | Escapes `&` then `<` then `>` in that order | — |

**Interactions**:

```
[CTA click]
     │
     ▼
[OpenContactModalButton] ──► [useContactModal().openContactModal(triggerEl)]
                                       │
                                       ▼
                           [ContactModalProvider: setIsOpen(true), store openerEl]
                                       │
                                       ▼
                         [ContactModal: dialogRef.showModal()]
                                       │
                                       ▼
                              [ContactForm (idle)]
                                       │
                                       ▼  submit
                              [submitContactLead()] ──► POST /api/contact
                                                            │
                                                            ▼
                                               [zod parse] ─► [honeypot check]
                                                                      │
                                                                      ▼
                                                      [telegramLeadNotifier]
                                                              │
                                                              ▼
                                                    [Telegram Bot API]
```

---

### Expected Changes

```
components/lead-capture/
├── contact-modal-provider.tsx      # NEW — React Context + mounts <ContactModal>
├── contact-modal.tsx               # NEW — native <dialog> wrapper + focus restore
├── contact-form.tsx                # NEW — react-hook-form + zod + status states
└── open-contact-modal-button.tsx   # NEW — client leaf wrapping BrandButton

lib/lead-capture/
├── contact-lead-schema.ts          # NEW — shared zod schema + ContactLead type
├── submit-contact-lead.ts          # NEW — client-side fetch wrapper
├── telegram-lead-notifier.ts       # NEW — Telegram Bot API adapter (server)
├── format-lead-message.ts          # NEW — HTML message formatter (server)
└── escape-telegram-html.ts         # NEW — HTML escape (& → < → >)

app/api/contact/
└── route.ts                        # NEW — POST handler

app/layout.tsx                      # UPDATE — wrap header/main/footer with ContactModalProvider
components/layout/site-header.tsx   # UPDATE — swap CTA at L52 (desktop), L92 (mobile)
components/hero/hero-section.tsx    # UPDATE — swap CTA at L52
components/services/service-detail-page.tsx  # UPDATE — swap CTAs at L58, L243
app/about/page.tsx                  # UPDATE — swap CTA at L181
app/portfolio/[slug]/page.tsx       # UPDATE — swap CTA at L102
.env.example                        # UPDATE — add TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
.env.local                          # NEW (gitignored) — local values for dev
```

---

### Building Block View

```
┌────────────────────────── app/layout.tsx ───────────────────────────┐
│                                                                     │
│  <ContactModalProvider>  (client, 'use client')                     │
│    ┌─────────────────────────────────────────────────────────┐      │
│    │  <SiteHeader> ──► OpenContactModalButton ──┐            │      │
│    │  <main>                                    │            │      │
│    │    {children}                              │            │      │
│    │      (server + client pages; each CTA ─────┤            │      │
│    │       renders OpenContactModalButton) ─────┤            │      │
│    │  </main>                                   │            │      │
│    │  <SiteFooter>                              │            │      │
│    └────────────────────────────────────────────┼────────────┘      │
│                                                 ▼                   │
│                              useContactModal().openContactModal()   │
│                                                 │                   │
│    ┌───────────────── ContactModal ─────────────┘                   │
│    │  <dialog ref> — showModal() / close()                          │
│    │    ├─ aria-labelledby, aria-modal                              │
│    │    ├─ onClick (backdrop detect) → closeContactModal            │
│    │    ├─ onClose → openerEl?.focus()                              │
│    │    └─ ContactForm                                              │
│    │          ├─ react-hook-form + zodResolver(contactLeadSchema)   │
│    │          ├─ honeypot input "website" (a11y-hidden)             │
│    │          ├─ status: idle / loading / success / error           │
│    │          └─ onSubmit → submitContactLead(data)                 │
│    └─────────────────────────────────────────────────────────┘      │
│                                                 │                   │
└─────────────────────────────────────────────────┼───────────────────┘
                                                  ▼
                                    fetch POST /api/contact
                                                  │
┌──────────────────────── app/api/contact/route.ts ───────────────────┐
│  1. JSON parse                                                      │
│  2. contactLeadSchema.safeParse → 400 on failure                    │
│  3. if website !== "" → 200 { ok: true }  (silent honeypot)         │
│  4. telegramLeadNotifier(lead) → 200 / 502                          │
│  5. missing env → 500 { ok: false, error: "configuration" }         │
└──────────────────────────┬──────────────────────────────────────────┘
                           ▼
┌──────────── lib/lead-capture/telegram-lead-notifier.ts ─────────────┐
│  formatLeadMessage(lead) using escapeTelegramHtml                   │
│  fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`,          │
│         { parse_mode: 'HTML', chat_id, text },                      │
│         { signal: AbortSignal.timeout(8000) })                      │
│  !ok → console.error(error_code, description) — token NEVER logged  │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Runtime Scenarios

**Scenario: Primary Flow — successful lead**

```
User ──► CTA click ──► OpenContactModalButton.onClick
                                 │
                                 ▼
                   openContactModal(buttonEl)
                                 │
                                 ▼
                [Provider: setIsOpen(true); openerRef = buttonEl]
                                 │
                                 ▼
                [ContactModal effect: dialogRef.showModal()]
                                 │
                                 ▼
                       autofocus → "name" input
                                 │
                                 ▼  user fills name, phone, (message); submit
                   [RHF + zod validate] ── invalid ──► inline errors, focus first invalid
                                 │ valid
                                 ▼
                      submitContactLead(data)
                                 │
                                 ▼
                   fetch('/api/contact', POST, JSON)
                                 │
                                 ▼
             [server: zod ok → honeypot empty → telegramLeadNotifier → 200 ok]
                                 │
                                 ▼
                    setStatus('success'); setTimeout(close, 3000)
                                 │
                                 ▼
                         dialog.close(); openerEl.focus()
                                 │
                                 ▼
                       Lead visible in Telegram chat
```

**Scenario: Alternative Flow — user closes before submit**

```
dialog open ──► (Escape key OR backdrop click OR X button)
                       │
                       ▼
               dialog.close() → onClose fires
                       │
                       ▼
          setIsOpen(false); openerEl.focus()
          (no network call; form state discarded)
```

**Scenario: Error Flow — Telegram unavailable**

```
submit ──► fetch /api/contact ──► zod ok ──► telegram fetch ──► non-2xx
                                                                   │
                                                                   ▼
                                               console.error(code, desc)   (no token)
                                                                   │
                                                                   ▼
                                                    Response 502 { ok:false }
                       │
                       ▼
         setError('root', 'Не удалось отправить заявку…')
         status='error'; form values preserved; submit button re-enabled
         error view shows tel: link for direct call
```

**Scenario: Honeypot Flow — bot submission**

```
bot fills "website" field ──► fetch /api/contact ──► zod ok
                                                         │
                                                         ▼
                                              website !== "" → 200 { ok:true }
                                              (telegramLeadNotifier NOT called)
```

**State Transitions (ContactForm)**:

```
  idle ─── submit ───► loading ─── 200 ────► success ─── 3s timer ────► (closed)
                           │
                           └──── !2xx ───► error ─── retry submit ───► loading
                                              │
                                              └── user edits any field ──► idle
```

---

### Architecture Decisions

**ADR-1: React Context + native `<dialog>` for global modal**

- **Status**: Accepted
- **Context**: The modal must be triggered from 7 CTAs spanning both server components (about, portfolio, service-detail) and client components (hero, header), without duplicating DOM nodes or state.
- **Options**:
  1. `ContactModalProvider` Context + native `<dialog>` mounted once in layout.
  2. Per-CTA local `useState` with a modal rendered in each component.
  3. URL-based modal state (`?contact=open`) via `useSearchParams`.
  4. Zustand (or similar) global store.
- **Decision**: Option 1.
- **Consequences**: Single DOM node; browser-provided a11y (focus trap, Escape, inert backdrop); server components render a client leaf (`OpenContactModalButton`) without adopting `"use client"` themselves; no new dependencies.

**ADR-2: Route Handler over Server Action**

- **Status**: Accepted
- **Context**: The task specifies `POST /api/contact` as the contract; submissions call the Telegram Bot API with server-only secrets.
- **Options**:
  1. Next.js Route Handler at `app/api/contact/route.ts`.
  2. React 19 Server Action + `useActionState`.
- **Decision**: Option 1.
- **Consequences**: Explicit HTTP contract matches the task; trivially testable with curl; cleaner boundary for the Telegram adapter; small amount of extra boilerplate vs Server Action accepted.

**ADR-3: Shared zod schema for client and server**

- **Status**: Accepted
- **Context**: Client-side validation (inline errors, formatted feedback) and server-side validation (trust boundary) must not drift.
- **Options**:
  1. One schema in `lib/lead-capture/contact-lead-schema.ts` imported by both sides.
  2. Two independent schemas maintained in parallel.
- **Decision**: Option 1.
- **Consequences**: One source of truth; zod tree-shakes cleanly in the client bundle; no risk of client/server divergence.

**ADR-4: Telegram adapter isolated behind a function port**

- **Status**: Accepted
- **Context**: The task's Scope explicitly excludes email fallback and database persistence today but does not rule out additional channels later.
- **Options**:
  1. Call `fetch('https://api.telegram.org/...')` directly inside the Route Handler.
  2. Encapsulate in `telegramLeadNotifier(lead): Promise<{ ok: boolean }>` behind a narrow port.
- **Decision**: Option 2.
- **Consequences**: Adding a secondary channel (e.g., email) later means adding a new adapter and a small composition, not rewriting the Route Handler or the UI. The Route Handler depends on the schema and the notifier port, not on the Telegram API shape.

---

### Contracts

**HTTP API Contract**

```
POST /api/contact
Headers:  Content-Type: application/json
Request:  {
            "name": string,                 // required, 1..100 chars after trim
            "phone": string,                // required; digits-only length >= 10
            "message"?: string,             // optional; 0..1000 chars
            "website"?: string              // honeypot; MUST be empty to deliver
          }

Responses:
  200 { "ok": true }                        // success OR honeypot silently dropped
  400 { "ok": false, "error": "validation", "issues": ZodIssue[] }
  500 { "ok": false, "error": "configuration" }   // missing TELEGRAM_* env var
  502 { "ok": false, "error": "upstream" }        // Telegram API non-2xx / timeout
```

**Domain Model — `ContactLead` (shared)**

```
ContactLead
├── name:     string (required, min 1, max 100)
├── phone:    string (required, digits-only length >= 10)
├── message?: string (optional, max 1000)
└── website?: string (optional honeypot — MUST be empty)
```

**Internal Interfaces**

```ts
// components/lead-capture/contact-modal-provider.tsx
interface ContactModalContextValue {
  openContactModal: (trigger?: HTMLElement | null) => void;
  closeContactModal: () => void;
}
function useContactModal(): ContactModalContextValue;

// lib/lead-capture/submit-contact-lead.ts
type SubmitContactLeadResult =
  | { ok: true }
  | { ok: false; reason: "network" | "validation" | "upstream" | "configuration" };
function submitContactLead(data: ContactLead): Promise<SubmitContactLeadResult>;

// lib/lead-capture/telegram-lead-notifier.ts (server-only)
function telegramLeadNotifier(lead: ContactLead): Promise<{ ok: boolean }>;

// lib/lead-capture/format-lead-message.ts (server-only)
function formatLeadMessage(lead: ContactLead): string;

// lib/lead-capture/escape-telegram-html.ts (server-only)
function escapeTelegramHtml(text: string): string;
```

**Environment Variables (server-only; no `NEXT_PUBLIC_` prefix)**

```
TELEGRAM_BOT_TOKEN   # Telegram Bot API token from @BotFather
TELEGRAM_CHAT_ID     # Target chat/group ID where leads are sent
```

Locations:
- `.env.example` (committed): both keys present with comments, values empty.
- `.env.local` (gitignored): real values for local dev.
- VPS: set in the process environment for PM2 before `npm run build && pm2 restart printscan-site` at `/var/www/printscan-site/.env.local`.

---

## Implementation Process

### Implementation Strategy

**Approach**: Mixed (bottom-up for data + server, top-down for UI shell, outside-in at HTTP boundary).

**Rationale**: The Telegram integration owns the most unknowns (HTML escape order, parse_mode HTML edge cases, env handling, fetch timeout). Building the data + server vertical first (schema -> escape -> format -> notifier -> route) lets us curl-test the API before any UI exists, de-risking the highest-uncertainty surface. The native `<dialog>` modal is well-understood (per skill), so its infrastructure is built top-down as an empty shell that the form is later slotted into. The CTA rewiring (highest blast radius — 7 sites in 5 files) is the LAST functional step, when the modal already works end-to-end and a regression is impossible.

### Least-to-Most Decomposition Chain

| Level | Subproblem | Depends On |
|-------|-----------|------------|
| L0a | `contactLeadSchema` + `ContactLead` type | — |
| L0b | `escapeTelegramHtml` (& -> < -> >) | — |
| L0c | `.env.example` (create — does not exist yet) | — |
| L1a | `formatLeadMessage(lead)` HTML body w/ Moscow timestamp | L0a, L0b |
| L1b | `submitContactLead(data)` typed client POST | L0a |
| L2a | `telegramLeadNotifier(lead)` adapter w/ 8s timeout | L1a |
| L2b | `ContactModalProvider` + `useContactModal` (modal infra, no form yet) | — |
| L3a | `POST /api/contact` route handler | L0a, L2a |
| L3b | `ContactForm` (RHF + zod, idle/loading/success/error states) | L0a, L1b |
| L4a | `OpenContactModalButton` client leaf | L2b |
| L4b | Wire provider into `app/layout.tsx`, slot ContactForm into modal | L2b, L3b |
| L5  | Replace 7 CTAs across 5 files | L4a, L4b |
| L6a | Build + manual verification of all UX states | L0–L5 |
| L6b | Document VPS env-var setup in PR/commit | L0c |

**Critical Path**: L0a -> L1b -> L3b -> L4b -> L5 (UI vertical) AND L0a -> L0b -> L1a -> L2a -> L3a (server vertical), merging at L4b.

**Parallel Opportunities**:
- L0a, L0b, L0c can run in parallel.
- L1a (server) and L1b (client) are independent.
- L2a (server) and L2b (UI) are fully independent.
- L3a (route) and L3b (form) are independent until runtime.

### Phase Overview

```
Phase 1: Setup (directories + .env.example)
    │
    ▼
Phase 2: Foundational (schema, escape, format, submit, notifier)
    │
    ▼
Phase 3: Modal Infrastructure (provider + hook + dialog shell)
    │
    ▼
Phase 4: HTTP Boundary (route handler)
    │
    ▼
Phase 5: Form + Integration (form, trigger leaf, layout wiring)
    │
    ▼
Phase 6: CTA Rewiring (7 sites in 5 files)
    │
    ▼
Phase 7: Polish (build verification + deployment note)
```

---

### Step 1: Setup — Directory Scaffold and Env Template

**Goal**: Create the bounded-context directories and the gitignored / committed env files so all subsequent modules have a stable home and the secrets contract is documented from the start.

#### Expected Output

- `components/lead-capture/.gitkeep` — empty directory marker (or first file from Step 7 lands here).
- `lib/lead-capture/.gitkeep` — empty directory marker.
- `app/api/contact/.gitkeep` — empty directory marker.
- `.env.example` — committed template with both Telegram keys + comments.
- `.env.local` — gitignored, populated locally with real dev values.
- `.gitignore` — verified to ignore `.env.local`.

#### Success Criteria

- [ ] Directories `components/lead-capture/`, `lib/lead-capture/`, `app/api/contact/` exist and are tracked by git.
- [ ] `.env.example` exists at repo root with `TELEGRAM_BOT_TOKEN=` and `TELEGRAM_CHAT_ID=` lines, each preceded by a one-line `#` comment explaining purpose.
- [ ] `.env.local` exists at repo root (real values from BotFather + chat ID) and is NOT tracked by git.
- [ ] `git status --ignored` shows `.env.local` under "Ignored files".
- [ ] No `NEXT_PUBLIC_` prefix appears on either Telegram key in either env file.

#### Subtasks

- [ ] Create directory `components/lead-capture/` with `.gitkeep`
- [ ] Create directory `lib/lead-capture/` with `.gitkeep`
- [ ] Create directory `app/api/contact/` with `.gitkeep`
- [ ] Create `.env.example` with `TELEGRAM_BOT_TOKEN=` and `TELEGRAM_CHAT_ID=` plus comments
- [ ] Verify `.gitignore` already excludes `.env.local` (it does via the standard Next.js template); add the line if missing
- [ ] Create `.env.local` locally with real values (not committed)
- [ ] Verify with `git status --ignored` that `.env.local` is ignored

#### Blockers

- Real values for `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` not yet in hand (needed for end-to-end Step 13 verification, NOT for Step 1 itself).

#### Risks

- Risk: developer accidentally commits `.env.local`. Mitigation: explicit `git status --ignored` check in success criteria.
- Risk: secret leaks via `NEXT_PUBLIC_` prefix. Mitigation: success criteria forbids the prefix; Stage 13 grep verifies.

#### Complexity / Uncertainty

- Complexity: Small. Uncertainty: Low.

#### Dependencies

- None (Level 0c).

#### Integration Points

- Future Steps 6, 8 read `process.env.TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` from these locations.
- VPS deployment (Step 13b) replicates `.env.local` at `/var/www/printscan-site/.env.local`.

#### Definition of Done

- [ ] All success criteria checked.
- [ ] `git status` shows new directories tracked, `.env.example` staged, `.env.local` ignored.

---

### Step 2: Foundational — `contactLeadSchema` (Shared zod Schema)

**Goal**: Define the single source of truth for lead validation that both the client form and the server route will import.

#### Expected Output

- `lib/lead-capture/contact-lead-schema.ts` — exports `contactLeadSchema` (zod) + `ContactLead` type (`z.infer`).

#### Success Criteria

- [ ] File `lib/lead-capture/contact-lead-schema.ts` exists.
- [ ] Schema has `name: z.string().min(1, { error: 'Укажите имя' }).max(100)`.
- [ ] Schema has `phone: z.string().min(1, { error: 'Укажите телефон' }).refine(v => v.replace(/\D/g, '').length >= 10, { error: 'Введите корректный номер телефона' })`.
- [ ] Schema has `message: z.string().max(1000).optional()`.
- [ ] Schema has `website: z.string().optional()` (honeypot — must be empty server-side).
- [ ] `ContactLead` type is exported via `z.infer<typeof contactLeadSchema>`.
- [ ] Smoke probe: `node --input-type=module -e "import('./lib/lead-capture/contact-lead-schema.ts').then(m => console.log(m.contactLeadSchema.safeParse({ name: 'A', phone: '+7 999 123 45 67' })))"` (or equivalent ts-node) returns `{ success: true }`.

#### Subtasks

- [ ] Create `lib/lead-capture/contact-lead-schema.ts`
- [ ] Define and export `contactLeadSchema` per success criteria
- [ ] Export `ContactLead = z.infer<typeof contactLeadSchema>`
- [ ] Manual probe via `npx tsx -e` or temporary REPL: valid input -> success; missing name -> failure with "Укажите имя"; phone "abc" -> failure with "Введите корректный номер телефона"

#### Blockers

- None.

#### Risks

- Risk: zod 4 deprecation of `message:` option. Mitigation: skill confirms `{ error: '...' }` is the v4 form; criteria above use it.

#### Complexity / Uncertainty

- Complexity: Small. Uncertainty: Low.

#### Dependencies

- Step 1 (directory exists).

#### Integration Points

- Imported by Step 5 (client submit), Step 8 (route), Step 9 (form).

#### Definition of Done

- [ ] All success criteria checked, including the smoke probe.
- [ ] `npm run build` still passes (no TS errors in this isolated file).

---

### Step 3: Foundational — `escapeTelegramHtml`

**Goal**: Provide a pure HTML escaper that guarantees user input cannot inject Telegram HTML tags, with the correct order (& first, then <, then >).

#### Expected Output

- `lib/lead-capture/escape-telegram-html.ts` — exports `escapeTelegramHtml(text: string): string`.

#### Success Criteria

- [ ] File `lib/lead-capture/escape-telegram-html.ts` exists.
- [ ] `escapeTelegramHtml('&')` returns `'&amp;'`.
- [ ] `escapeTelegramHtml('<')` returns `'&lt;'`.
- [ ] `escapeTelegramHtml('>')` returns `'&gt;'`.
- [ ] `escapeTelegramHtml('<b>Test</b>')` returns `'&lt;b&gt;Test&lt;/b&gt;'`.
- [ ] `escapeTelegramHtml('A & B')` returns `'A &amp; B'` (NOT `'A &amp;amp; B'` — proves `&` is escaped first).
- [ ] Function body is under 50 lines.

#### Subtasks

- [ ] Create `lib/lead-capture/escape-telegram-html.ts`
- [ ] Implement using three sequential `.replace(/&/g, ...)` then `.replace(/</g, ...)` then `.replace(/>/g, ...)`
- [ ] Manual probe of all 5 success-criteria test cases via `npx tsx -e`

#### Blockers

- None.

#### Risks

- Risk: replacing `<` or `>` before `&` causes double-encoding. Mitigation: success criterion #5 catches it.

#### Complexity / Uncertainty

- Complexity: Small. Uncertainty: Low.

#### Dependencies

- Step 1.

#### Integration Points

- Imported by Step 4 (`formatLeadMessage`).

#### Definition of Done

- [ ] All success criteria checked.

---

### Step 4: Foundational — `formatLeadMessage`

**Goal**: Convert a typed `ContactLead` into the multiline HTML message body that Telegram receives, with all user-supplied fields HTML-escaped and a Moscow-timezone timestamp.

#### Expected Output

- `lib/lead-capture/format-lead-message.ts` — exports `formatLeadMessage(lead: ContactLead): string`.

#### Success Criteria

- [ ] File `lib/lead-capture/format-lead-message.ts` exists.
- [ ] Output starts with `<b>Новая заявка с сайта</b>`.
- [ ] Output contains `<b>Имя:</b> ${escapedName}` line.
- [ ] Output contains `<b>Телефон:</b> ${escapedPhone}` line.
- [ ] If `lead.message` is non-empty, output contains `<b>Сообщение:</b> ${escapedMessage}` line; otherwise that line is absent.
- [ ] Output contains `<b>Получено:</b> <date> МСК` where `<date>` is `new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })`.
- [ ] Probe with `lead = { name: '<b>Test</b>', phone: '+79991234567', message: undefined }` returns a string containing `&lt;b&gt;Test&lt;/b&gt;` and NOT containing literal `<b>Test</b>` outside the bold-tag wrapper.
- [ ] Function body is under 50 lines.

#### Subtasks

- [ ] Create `lib/lead-capture/format-lead-message.ts`
- [ ] Import `escapeTelegramHtml` and `ContactLead`
- [ ] Build line array, filter out null for missing message, join with `\n`
- [ ] Manual probe via `npx tsx -e` for: full lead, lead without message, lead with `<b>` injection in name (success criterion #7)

#### Blockers

- None.

#### Risks

- Risk: server timezone differs from Moscow → wrong timestamp. Mitigation: explicit `timeZone: 'Europe/Moscow'` option (Node 22 supports Intl).

#### Complexity / Uncertainty

- Complexity: Small. Uncertainty: Low.

#### Dependencies

- Step 2 (`ContactLead` type), Step 3 (`escapeTelegramHtml`).

#### Integration Points

- Imported by Step 6 (`telegramLeadNotifier`).

#### Definition of Done

- [ ] All success criteria checked.

---

### Step 5: Foundational — `submitContactLead` (Client POST Helper)

**Goal**: Provide a typed, browser-side helper that POSTs a `ContactLead` to `/api/contact` and returns a discriminated-union result so the form can render the right state.

#### Expected Output

- `lib/lead-capture/submit-contact-lead.ts` — exports `submitContactLead(data: ContactLead): Promise<SubmitContactLeadResult>` and the `SubmitContactLeadResult` type.

#### Success Criteria

- [ ] File `lib/lead-capture/submit-contact-lead.ts` exists.
- [ ] Type `SubmitContactLeadResult` is `{ ok: true } | { ok: false; reason: 'network' | 'validation' | 'upstream' | 'configuration' }`.
- [ ] Function POSTs JSON to `/api/contact` with `Content-Type: application/json`.
- [ ] On `res.ok` returns `{ ok: true }`.
- [ ] On HTTP 400 returns `{ ok: false, reason: 'validation' }`.
- [ ] On HTTP 500 returns `{ ok: false, reason: 'configuration' }`.
- [ ] On HTTP 502 returns `{ ok: false, reason: 'upstream' }`.
- [ ] On `fetch` throw / network error returns `{ ok: false, reason: 'network' }` (never re-throws).
- [ ] Function body is under 50 lines.

#### Subtasks

- [ ] Create `lib/lead-capture/submit-contact-lead.ts`
- [ ] Import `ContactLead` type
- [ ] Implement the fetch wrapper with try/catch; map status codes per success criteria
- [ ] After Step 8 exists, smoke-test via browser console: `await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'A', phone: '+79991234567' }) })`

#### Blockers

- None at build time. End-to-end probe requires Step 8.

#### Risks

- Risk: unhandled promise rejection caused by `fetch` throwing on offline. Mitigation: try/catch wrapping the whole call.

#### Complexity / Uncertainty

- Complexity: Small. Uncertainty: Low.

#### Dependencies

- Step 2.

#### Integration Points

- Imported by Step 9 (`ContactForm`).

#### Definition of Done

- [ ] All success criteria checked at the type-level (`npm run build` passes).
- [ ] Browser-console smoke probe deferred to Step 8 / Step 13.

---

### Step 6: Foundational — `telegramLeadNotifier` (Server Adapter)

**Goal**: Encapsulate the Telegram Bot API call behind a single function port so the route handler depends on a stable interface, with timeout, env validation, and token-safe error logging.

#### Expected Output

- `lib/lead-capture/telegram-lead-notifier.ts` — exports `telegramLeadNotifier(lead: ContactLead): Promise<{ ok: true } | { ok: false; reason: 'configuration' | 'upstream' }>`.

#### Success Criteria

- [ ] File `lib/lead-capture/telegram-lead-notifier.ts` exists.
- [ ] If either `process.env.TELEGRAM_BOT_TOKEN` or `process.env.TELEGRAM_CHAT_ID` is undefined / empty, returns `{ ok: false, reason: 'configuration' }` and logs a warning that does NOT contain the token value.
- [ ] Calls `https://api.telegram.org/bot${TOKEN}/sendMessage` with method POST, JSON body containing `chat_id`, `parse_mode: 'HTML'`, and `text` from `formatLeadMessage(lead)`.
- [ ] Uses `signal: AbortSignal.timeout(8000)`.
- [ ] On non-2xx, logs `console.error('Telegram API error:', error_code, description)` (no token in log) and returns `{ ok: false, reason: 'upstream' }`.
- [ ] On 2xx returns `{ ok: true }`.
- [ ] On thrown fetch error (timeout, DNS, etc.), logs error WITHOUT token and returns `{ ok: false, reason: 'upstream' }`.
- [ ] File is under 100 LOC; main function under 50 LOC.
- [ ] No `NEXT_PUBLIC_` import or reference in the file.

#### Subtasks

- [ ] Create `lib/lead-capture/telegram-lead-notifier.ts`
- [ ] Import `formatLeadMessage` and `ContactLead`
- [ ] Implement env-validation guard clause (early return)
- [ ] Implement fetch with `AbortSignal.timeout(8000)`
- [ ] Map non-2xx → `upstream`, thrown error → `upstream`
- [ ] Verify token never appears in any `console.*` argument by code review
- [ ] After Step 8, end-to-end probe with real env vars from a curl call confirms a Telegram message arrives

#### Blockers

- End-to-end probe needs Step 8 + real env vars from Step 1. Type/build verification works standalone.

#### Risks

- Risk (HIGH): token leaked via stack trace or `console.error(error)` that includes the request URL. Mitigation: only log `error_code` and `description` from parsed JSON; if catch branch logs the raw error, redact the URL or log only `error.name` + `error.message`.
- Risk: 8s timeout too short on slow networks. Mitigation: p95 from skill is well under 2s; 8s is generous.

#### Complexity / Uncertainty

- Complexity: Medium (env handling + error mapping + log hygiene). Uncertainty: Low (skill provides the recipe).

#### Dependencies

- Step 4 (`formatLeadMessage`), Step 1 (env vars).

#### Integration Points

- Called by Step 8 (route handler).

#### Definition of Done

- [ ] All success criteria checked.
- [ ] Code review confirms token is never passed to any `console.*` call.

---

### Step 7: Modal Infrastructure — `ContactModalProvider` + `useContactModal`

**Goal**: Provide a single client-side React Context that holds modal open/close state, owns the one `<dialog>` DOM node, and restores focus to the opener on close — without depending on the form yet.

#### Expected Output

- `components/lead-capture/contact-modal-provider.tsx` — exports `ContactModalProvider` (component) and `useContactModal` (hook).
- `components/lead-capture/contact-modal.tsx` — exports `ContactModal` component (wraps `<dialog>`, accepts `children` prop for the body).

#### Success Criteria

- [ ] File `components/lead-capture/contact-modal-provider.tsx` exists, marked `'use client'`.
- [ ] Context shape: `{ openContactModal: (trigger?: HTMLElement | null) => void; closeContactModal: () => void }`.
- [ ] `useContactModal()` throws a clear error if called outside the provider.
- [ ] Provider stores opener element in a ref when `openContactModal(triggerEl)` is called.
- [ ] File `components/lead-capture/contact-modal.tsx` exists, marked `'use client'`.
- [ ] `ContactModal` accepts `children: ReactNode` for body content.
- [ ] `ContactModal` renders a single `<dialog>` element with `aria-labelledby` (pointing to a heading id), `aria-modal="true"`, X close button (lucide-react `X` icon).
- [ ] Effect in `ContactModal`: when `isOpen && !dialogRef.current?.open` → `dialogRef.current.showModal()`; when `!isOpen && dialogRef.current?.open` → `dialogRef.current.close()`.
- [ ] `onClose` handler on `<dialog>` calls `closeContactModal()` AND restores focus to the stored opener via `openerRef.current?.focus()`.
- [ ] `onClick` handler on `<dialog>` closes when `e.target === dialogRef.current` (backdrop click).
- [ ] Provider mounts `<ContactModal>` once and renders `{children}` adjacent to it (NOT inside).
- [ ] Provider's React tree under `{children}` is not duplicated regardless of how many times `useContactModal()` is called.
- [ ] Provider file ≤ 100 LOC; ContactModal file ≤ 100 LOC; no individual function > 50 LOC.

#### Subtasks

- [ ] Create `components/lead-capture/contact-modal.tsx` with `<dialog>`, X button, backdrop-click handler, `onClose` handler, body slot via `children` prop
- [ ] Create `components/lead-capture/contact-modal-provider.tsx` with `'use client'`, Context, hook, opener ref, isOpen state, `<ContactModal>` mount
- [ ] Apply design tokens from skill: `bg-surface-raised`, `border-border`, `rounded-2xl`, `text-foreground`, dialog `::backdrop` styled via Tailwind arbitrary class or globals.css (`dialog::backdrop { background: rgb(6 7 10 / 0.8); backdrop-filter: blur(4px); }`)
- [ ] Manual smoke (after Step 11): open via temporary trigger, press Escape → closes; click backdrop → closes; click X → closes; click inside dialog → does NOT close
- [ ] Manual smoke: focus returns to opener after each close path

#### Blockers

- Visual smoke requires Step 11 (provider mounted in layout) AND a temporary trigger. Logic verification can be done with React DevTools.

#### Risks

- Risk: React Strict Mode double-invokes effects, calling `showModal()` twice → throws. Mitigation: `if (!dialogRef.current?.open)` guard before `showModal`.
- Risk: `onClose` fires when dialog closes via Escape AND when called via `.close()`, potentially re-triggering state updates. Mitigation: idempotent `setIsOpen(false)`; opener ref is stable.
- Risk: dialog `::backdrop` cannot be styled by Tailwind out of the box. Mitigation: add a `dialog::backdrop` rule to `app/globals.css` (one block).

#### Complexity / Uncertainty

- Complexity: Medium. Uncertainty: Low (pattern documented in skill).

#### Dependencies

- Step 1.

#### Integration Points

- Step 9 (`ContactForm`) is rendered as the `children` of `<ContactModal>`.
- Step 10 (`OpenContactModalButton`) consumes `useContactModal()`.
- Step 11 mounts the provider in `app/layout.tsx`.

#### Definition of Done

- [ ] All success criteria checked.
- [ ] `npm run build` passes.

---

### Step 8: HTTP Boundary — `POST /api/contact` Route Handler

**Goal**: Implement the explicit HTTP contract that parses JSON, validates with the shared schema, short-circuits the honeypot to 200, and delegates to the Telegram notifier — with status codes mapped per the contract in the architecture overview.

#### Expected Output

- `app/api/contact/route.ts` — exports `POST` async function returning `Response`.

#### Success Criteria

- [ ] File `app/api/contact/route.ts` exists.
- [ ] Exports `async function POST(req: Request): Promise<Response>`.
- [ ] Parses `await req.json()` inside try/catch; invalid JSON → 400 `{ ok: false, error: 'validation' }`.
- [ ] Calls `contactLeadSchema.safeParse(body)`; on `!success` → 400 `{ ok: false, error: 'validation', issues: parsed.error.issues }`.
- [ ] If `parsed.data.website` is non-empty → returns 200 `{ ok: true }` WITHOUT calling notifier (silent honeypot).
- [ ] Otherwise calls `telegramLeadNotifier(parsed.data)`.
- [ ] On `{ ok: true }` → 200 `{ ok: true }`.
- [ ] On `{ ok: false, reason: 'configuration' }` → 500 `{ ok: false, error: 'configuration' }`.
- [ ] On `{ ok: false, reason: 'upstream' }` → 502 `{ ok: false, error: 'upstream' }`.
- [ ] Token does not appear in any response body or log line.
- [ ] File is under 100 LOC; POST function under 50 LOC.

#### Subtasks

- [ ] Create `app/api/contact/route.ts`
- [ ] Import `contactLeadSchema` and `telegramLeadNotifier`
- [ ] Implement POST with early-return guard clauses (no nested ifs)
- [ ] curl probe with `.env.local` set: `curl -i -X POST http://localhost:3000/api/contact -H 'Content-Type: application/json' -d '{"name":"Smoke","phone":"+79991234567"}'` → expect 200, Telegram message arrives
- [ ] curl probe (validation fail): `-d '{}'` → expect 400 with `validation` error
- [ ] curl probe (honeypot): `-d '{"name":"Bot","phone":"+79991234567","website":"http://spam.example"}'` → expect 200, NO Telegram message
- [ ] curl probe (HTML injection): `-d '{"name":"<b>X</b>","phone":"+79991234567"}'` → Telegram message shows literal `<b>X</b>` text

#### Blockers

- End-to-end requires real env vars from Step 1 + Step 6.

#### Risks

- Risk: returning ZodIssue array leaks server internals. Mitigation: issues array contains only field path + message — already client-safe.
- Risk: forgetting CORS — not needed (same-origin POST).

#### Complexity / Uncertainty

- Complexity: Medium. Uncertainty: Low.

#### Dependencies

- Step 2 (schema), Step 6 (notifier).

#### Integration Points

- Called by Step 5 (`submitContactLead`).

#### Definition of Done

- [ ] All success criteria checked.
- [ ] All four curl probes return the expected status + side effect.
- [ ] `npm run build` passes.

---

### Step 9: `ContactForm` Component

**Goal**: Render a fully-featured RHF + zod form with name/phone/message + hidden honeypot, manage idle / loading / success / error states, and call `submitContactLead` on submit.

#### Expected Output

- `components/lead-capture/contact-form.tsx` — exports `ContactForm` (default or named), `'use client'`.

#### Success Criteria

- [ ] File `components/lead-capture/contact-form.tsx` exists, marked `'use client'`.
- [ ] Uses `useForm<ContactLead>({ resolver: zodResolver(contactLeadSchema) })`.
- [ ] Renders inputs: `name` (text, required, autoFocus, label "Имя"), `phone` (tel, required, label "Телефон"), `message` (textarea, optional, label "Сообщение"), `website` (honeypot — visually hidden via `position:absolute; opacity:0; height:0; pointer-events:none; left:-9999px`; `tabIndex={-1}`; `autoComplete="off"`).
- [ ] Inputs are `disabled` when `isSubmitting === true`.
- [ ] Submit button shows spinner (lucide-react `Loader2` with `animate-spin`) and is `disabled` when `isSubmitting === true`.
- [ ] On invalid submit, focus moves to first invalid field (RHF's `shouldFocusError: true` default).
- [ ] On successful POST: status switches to `'success'`, renders success message "Заявка отправлена! Мы свяжемся в течение рабочего дня.", and triggers a 3-second `setTimeout` that calls a `onClose` prop (passed by parent).
- [ ] On HTTP error: status switches to `'error'`, renders message "Не удалось отправить заявку. Попробуйте ещё раз или позвоните: <tel link>" with `tel:` href from `companyInfo.phone`; form values preserved; submit button re-enabled.
- [ ] Status message containers have `aria-live="polite"`.
- [ ] Form heading has the id referenced by `<dialog aria-labelledby>` from Step 7 (e.g. `id="contact-modal-title"`).
- [ ] On status change to 'idle' (e.g., user edits a field), error banner clears.
- [ ] Component file ≤ 200 LOC; submit handler ≤ 50 LOC; if exceeded, extract `useContactFormSubmit` hook into the same file or a sibling `use-contact-form-submit.ts`.
- [ ] Phone field accepts the documented format (`+7 999 123 45 67`); validation per shared schema.

#### Subtasks

- [ ] Create `components/lead-capture/contact-form.tsx`
- [ ] Set up `useForm` with `zodResolver(contactLeadSchema)`
- [ ] Render fields with labels, inline error messages from `formState.errors`
- [ ] Render honeypot input absolutely-positioned offscreen
- [ ] Wire submit handler that calls `submitContactLead(data)` and updates a local `status` state machine (`idle → loading → success | error`)
- [ ] Implement 3-second auto-close on success via `useEffect` + `setTimeout` (cleanup on unmount)
- [ ] Apply design tokens from skill: input `bg-background border-border focus-visible:ring-brand/60`, submit button reuses `BrandButton as="button"` variant primary
- [ ] Manual smoke: empty submit → both inline errors, focus on name; phone "abc" → phone error; valid submit → loading → success → auto-close in 3s; force 502 by stopping dev server briefly → error state with tel link
- [ ] Verify keyboard tab cycle stays inside dialog (browser-provided by `<dialog>` modal)

#### Blockers

- Telegram side smoke requires Step 1 + 6 + 8 functional.

#### Risks

- Risk: `setTimeout` leaks if user closes modal before 3s elapses. Mitigation: store timer id, clear on unmount AND on `onClose` invocation.
- Risk: file balloons past 200 LOC. Mitigation: split fields/hook per skill guidance; bounded-context-domain naming (`contact-form-fields.tsx`, `use-contact-form-submit.ts`).

#### Complexity / Uncertainty

- Complexity: Medium. Uncertainty: Low (RHF + zod is well documented).

#### Dependencies

- Step 2 (schema), Step 5 (submit), Step 7 (modal will own the `onClose` prop wiring).

#### Integration Points

- Mounted as `children` of `<ContactModal>` in Step 11.

#### Definition of Done

- [ ] All success criteria checked.
- [ ] All four UX states manually verified.
- [ ] `npm run build` passes.

---

### Step 10: `OpenContactModalButton` (Client Leaf)

**Goal**: Provide a thin `'use client'` wrapper around `BrandButton as="button"` that calls `useContactModal().openContactModal(buttonEl)` on click — safe to import and render from server components.

#### Expected Output

- `components/lead-capture/open-contact-modal-button.tsx` — exports `OpenContactModalButton`.

#### Success Criteria

- [ ] File exists, marked `'use client'`.
- [ ] Props: `{ variant?: 'primary' | 'ghost' | 'outline'; className?: string; children: ReactNode; ariaLabel?: string }`.
- [ ] Renders `<BrandButton as="button" variant={...} className={...} onClick={...}>{children}</BrandButton>`.
- [ ] Stores own `useRef<HTMLButtonElement>` and passes it to `BrandButton`'s underlying `<button>` (verify `BrandButton` accepts `ref` — if not, wrap in `forwardRef` or render a native button directly with the same `BrandButton` styles).
- [ ] On click, calls `openContactModal(buttonRef.current)`.
- [ ] Importable from a server component without converting that component to `'use client'` (verified by Step 12 wiring `app/about/page.tsx` which is a server component).
- [ ] File ≤ 60 LOC.

#### Subtasks

- [ ] Read `components/ui/brand-button.tsx` to confirm whether it forwards refs; if not, decide between (a) adding `forwardRef` wrapper here that captures opener via the wrapper's own div, or (b) rendering a native `<button>` with the same `cn(baseStyles, variantStyles[variant])` import
- [ ] Create `components/lead-capture/open-contact-modal-button.tsx`
- [ ] Implement and wire `useContactModal()`
- [ ] Render in a tiny test page or Step 12 to verify import from a server component works (no "use client" needed in caller)

#### Blockers

- Step 7 must be complete (provides `useContactModal`).

#### Risks

- Risk (MEDIUM): `BrandButton` may not forward `ref`. Mitigation: subtask above evaluates and picks one of two solutions; the native-button fallback uses the same Tailwind class string, no visual regression.
- Risk: forgetting opener ref → focus does not return on close. Mitigation: Step 7 explicitly stores the opener ref; this step passes it.

#### Complexity / Uncertainty

- Complexity: Small. Uncertainty: Low (one ref-forwarding decision).

#### Dependencies

- Step 7 (`useContactModal`).

#### Integration Points

- Used by Step 12 to replace 7 CTAs.

#### Definition of Done

- [ ] All success criteria checked.
- [ ] Imported from a server component without errors.

---

### Step 11: Layout Wiring — Mount Provider + Form into Modal

**Goal**: Wrap the existing `<SiteHeader>`, `<main>{children}</main>`, `<SiteFooter>` subtree with `<ContactModalProvider>` so every CTA (including the two in `<SiteHeader>`) can open the modal, and slot `<ContactForm>` into `<ContactModal>` as its body.

#### Expected Output

- `app/layout.tsx` — modified to import `ContactModalProvider` and wrap header + main + footer. The `<ContactModal>` body now holds `<ContactForm>` (wired in Step 7's `ContactModal` body slot OR in Step 11 as a passed child — whichever Step 7 chose).

#### Success Criteria

- [ ] `app/layout.tsx` imports `ContactModalProvider` from `@/components/lead-capture/contact-modal-provider`.
- [ ] `<SiteHeader />`, `<main className="flex-1">{children}</main>`, `<SiteFooter />` are all rendered inside `<ContactModalProvider>`.
- [ ] `<LocalBusinessSchema />`, `<CustomCursor />`, `<CursorSpotlight />`, `<YandexMetrika />` placement is unchanged (cosmetic — provider does not need to wrap them, but wrapping is harmless).
- [ ] `<ContactModal>`'s body is `<ContactForm onClose={closeContactModal} />` (provider passes the closer to the form via prop).
- [ ] Provider mounts exactly one `<dialog>` DOM node (verified via DevTools: `document.querySelectorAll('dialog').length === 1`).
- [ ] Build passes; layout still renders all four metadata exports unchanged.

#### Subtasks

- [ ] Edit `app/layout.tsx`:
  - Import `ContactModalProvider`
  - Wrap `<SiteHeader />` through `<SiteFooter />` with `<ContactModalProvider>` opening tag and matching close
- [ ] Inside `ContactModal` (from Step 7), render `<ContactForm onClose={closeContactModal} />` (or wire via children — depending on Step 7's chosen API)
- [ ] Add a temporary CTA on the home page (e.g., a `<button>` calling `openContactModal()`) to manually verify open/close before Step 12 swaps the real CTAs
- [ ] Manual smoke: open modal from temporary trigger, fill + submit, expect Telegram message; remove temporary trigger
- [ ] Verify `document.querySelectorAll('dialog').length === 1` in DevTools

#### Blockers

- Steps 7, 9 complete.

#### Risks

- Risk: provider blocks RSC streaming for the entire page. Mitigation: provider wraps only the body subtree, NOT `<html>` / `<body>` / `<head>`.
- Risk: header/footer become client components by association. Mitigation: incorrect — Next.js RSC boundary rule allows server components to be passed as children of a client component without conversion.

#### Complexity / Uncertainty

- Complexity: Small. Uncertainty: Low.

#### Dependencies

- Steps 7, 9.

#### Integration Points

- Enables Step 12 (CTA replacements all rely on the provider being mounted).

#### Definition of Done

- [ ] All success criteria checked.
- [ ] Temporary trigger removed before commit.

---

### Step 12: CTA Rewiring — Replace 7 Buttons Across 5 Files

**Goal**: Atomically swap every existing CTA `BrandButton` that points to dead anchors `/#contact` or `/#inquiry` with `<OpenContactModalButton>`, preserving labels and visual variants exactly.

#### Expected Output

- 5 modified files; 7 button replacements:
  - `components/hero/hero-section.tsx` (1 at L52)
  - `components/layout/site-header.tsx` (2 at L52 desktop, L92 mobile)
  - `components/services/service-detail-page.tsx` (2 at L58, L243)
  - `app/about/page.tsx` (1 at L181)
  - `app/portfolio/[slug]/page.tsx` (1 at L102)

#### Success Criteria

- [ ] Each replaced button uses `<OpenContactModalButton>` with the same visible label text ("Получить консультацию" or "Оставить заявку").
- [ ] Each replaced button preserves the existing `variant` (primary / ghost / outline) and any custom `className`.
- [ ] The `href` prop is gone from all 7 sites — `grep -rn "/#contact\|/#inquiry" components app` returns ZERO results.
- [ ] `grep -rn "Получить консультацию\|Оставить заявку" components app` returns 7 sites, each wrapped in `<OpenContactModalButton>`.
- [ ] No previously-server-component file (about/page.tsx, portfolio/[slug]/page.tsx, service-detail-page.tsx) gained `'use client'` directive.
- [ ] `npm run build` passes.
- [ ] Manual smoke: clicking each of the 7 CTAs in a running dev server opens the modal within ~100 ms and focuses the name input.

#### Subtasks

- [ ] Edit `components/hero/hero-section.tsx`: replace L52 BrandButton
- [ ] Edit `components/layout/site-header.tsx`: replace L52 (desktop), L92 (mobile)
- [ ] Edit `components/services/service-detail-page.tsx`: replace L58, L243
- [ ] Edit `app/about/page.tsx`: replace L181 (verify no `'use client'` was added)
- [ ] Edit `app/portfolio/[slug]/page.tsx`: replace L102 (verify no `'use client'` was added)
- [ ] Run `grep -rn "/#contact\|/#inquiry" components app` → expect zero matches
- [ ] Click-through smoke of all 7 CTAs in dev server
- [ ] On mobile-menu CTA in `site-header.tsx`, verify modal opens AND mobile menu auto-closes (or document if not in scope — task says modal opens, mobile-menu close behavior is not in ACs)

#### Blockers

- Steps 10, 11 complete.

#### Risks

- Risk (MEDIUM): one CTA missed → user reports a dead button. Mitigation: explicit grep check in success criteria; analysis lists exact line numbers.
- Risk: server-component file accidentally adds `'use client'` because of an unrelated import pulled along with `OpenContactModalButton`. Mitigation: `OpenContactModalButton` is itself `'use client'`; importing a client component in a server file is allowed and does NOT contaminate the parent.

#### Complexity / Uncertainty

- Complexity: Medium (touch surface = 5 files). Uncertainty: Low.

#### Dependencies

- Steps 10, 11.

#### Integration Points

- All replaced sites now share one modal instance.

#### Definition of Done

- [ ] All success criteria checked.
- [ ] All 7 manual click-throughs pass.
- [ ] `npm run build` passes.

---

### Step 13: Polish — Build Verification + Deployment Note

**Goal**: Gate the feature on a clean production build, manually verify all 14 functional + 5 non-functional ACs, and document the VPS env-var step in the PR/commit body.

#### Expected Output

- Clean `npm run build` output (no TS errors, no ESLint warnings).
- Manually verified all ACs (checklist).
- PR/commit body containing the deployment note.

#### Success Criteria

- [ ] `npm run build` exits 0 with no TypeScript errors and no ESLint warnings.
- [ ] `grep -RIn "TELEGRAM_BOT_TOKEN" .next/static .next/server/app/page* 2>/dev/null` returns ZERO matches in any client bundle (proves token never reaches the browser per AC `Server-only secrets`).
- [ ] All 14 Functional Requirements ACs from the task file pass manual verification.
- [ ] All 5 Non-Functional Requirements ACs pass manual verification (Performance: time the submit; Security: token grep; Accessibility: keyboard tab + screen reader; Compatibility: open in Chrome/Safari/Firefox + iOS + Android; Reliability: stop telegram, expect 502 + error UX).
- [ ] PR/commit body includes the exact deployment commands:
  ```
  ssh root@85.239.48.122
  cd /var/www/printscan-site
  # one-time: create .env.local with TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
  git pull
  npm run build
  pm2 restart printscan-site --update-env
  ```
  with note that `--update-env` is required for PM2 to pick up new env vars.

#### Subtasks

- [ ] Run `npm run build`; fix any TS / ESLint issue
- [ ] Run the bundle grep for `TELEGRAM_BOT_TOKEN`; expect zero matches
- [ ] Walk through every AC in the task file checking off pass/fail with notes
- [ ] Draft PR body with deployment instructions (or commit message body if no PR)
- [ ] Confirm `.env.local` is NOT in any git diff staged for commit
- [ ] Confirm `.env.example` IS in the staged diff

#### Blockers

- All prior steps must be complete.

#### Risks

- Risk: `pm2 restart` without `--update-env` keeps stale env. Mitigation: explicit flag in the deployment note.
- Risk: developer forgets to create `.env.local` on VPS → first form submission hits 500. Mitigation: deployment note calls it out as one-time step.

#### Complexity / Uncertainty

- Complexity: Small. Uncertainty: Low.

#### Dependencies

- Steps 1–12.

#### Integration Points

- Final gate before deploy.

#### Definition of Done

- [ ] All success criteria checked.

---

## Implementation Summary

| Step | Goal | Output | Est. Effort |
|------|------|--------|-------------|
| 1 | Setup directories + env template | `lib/lead-capture/`, `components/lead-capture/`, `app/api/contact/`, `.env.example`, `.env.local` | S |
| 2 | Shared zod schema | `lib/lead-capture/contact-lead-schema.ts` | S |
| 3 | HTML escape utility | `lib/lead-capture/escape-telegram-html.ts` | S |
| 4 | Telegram message formatter | `lib/lead-capture/format-lead-message.ts` | S |
| 5 | Client POST helper | `lib/lead-capture/submit-contact-lead.ts` | S |
| 6 | Telegram adapter w/ timeout | `lib/lead-capture/telegram-lead-notifier.ts` | M |
| 7 | Modal provider + dialog shell | `components/lead-capture/contact-modal-provider.tsx`, `contact-modal.tsx` | M |
| 8 | Route handler | `app/api/contact/route.ts` | M |
| 9 | Form with RHF + zod + UX states | `components/lead-capture/contact-form.tsx` | M |
| 10 | Trigger client leaf | `components/lead-capture/open-contact-modal-button.tsx` | S |
| 11 | Layout wiring | `app/layout.tsx` (modified) | S |
| 12 | Replace 7 CTAs across 5 files | 5 component/page files (modified) | M |
| 13 | Build + manual ACs + deployment note | PR/commit body | S |

**Total Steps**: 13
**Critical Path**: 2 → 3 → 4 → 6 → 8 (server vertical) AND 2 → 5 → 9 → 11 → 12 (UI vertical), merging at Step 11.
**Parallel Opportunities**:
- L0: Steps 1, 2, 3 can run simultaneously.
- L1: Steps 4 (server) and 5 (client) are independent.
- L2: Steps 6 (server) and 7 (UI shell) are fully independent.
- L3: Steps 8 (route) and 9 (form) are independent.
- Two devs could split as: Dev A owns Steps 1, 2, 3, 4, 6, 8 (server + foundation); Dev B owns Steps 7, 9, 10 (UI). They merge at Step 11.

---

## Risks & Blockers Summary

### High Priority

| Risk/Blocker | Impact | Likelihood | Mitigation |
|--------------|--------|------------|------------|
| `TELEGRAM_BOT_TOKEN` leaked via `console.error(err)` including request URL | High | Medium | Step 6 success criteria + code review forbids passing `error` directly; only `error_code`+`description` from parsed body, or `error.name`+`error.message` in catch |
| `.env.local` missing on VPS → first submit hits 500 | High | High | Step 13 deployment note documents one-time `.env.local` creation + `pm2 restart --update-env` |
| One of 7 CTAs missed during rewiring | Medium | Medium | Step 12 grep `/#contact\|/#inquiry` must return zero |
| `BrandButton` does not forward refs → opener focus restoration breaks | Medium | Medium | Step 10 explicitly evaluates ref-forwarding and picks fallback (native `<button>` with same `cn` styles) |
| React Strict Mode double-invokes `showModal()` → throws | Medium | Low | Step 7 success criteria require `if (!dialogRef.current?.open)` guard |
| HTML escape order wrong (e.g., `<` before `&`) → double encoding | High | Low | Step 3 success criterion #5 (`'A & B'` test) catches it deterministically |
| `setTimeout` for auto-close leaks if user closes modal early | Low | Medium | Step 9 cleanup on unmount + on `onClose` |
| Server component accidentally promoted to `'use client'` via Step 12 | Low | Low | Step 12 success criteria explicitly checks; `'use client'` in `OpenContactModalButton` does NOT propagate |

---

## High Complexity / Uncertainty Tasks Requiring Attention

No tasks rated High in either Complexity or Uncertainty. The two highest-impact items are:

- **Step 6 (`telegramLeadNotifier`)**: Medium complexity (env validation + error mapping + log-hygiene). Uncertainty: Low — the skill provides the exact recipe. Recommendation: **proceed as-is**, with the strict log-hygiene rule in success criteria.
- **Step 9 (`ContactForm`)**: Medium complexity (state machine + RHF wiring + status views + auto-close timer). Uncertainty: Low. Recommendation: **proceed as-is**; pre-commitment to extract `<ContactFormFields>` and `useContactFormSubmit` if file crosses 200 LOC keeps it within the file-size rule.

No spike tasks needed.

---

## Definition of Done (Task Level)

- [ ] All 13 implementation steps completed.
- [ ] All 14 Functional Requirements ACs verified.
- [ ] All 5 Non-Functional Requirements ACs verified.
- [ ] `npm run build` passes with zero TS / ESLint errors.
- [ ] `grep` of client bundles shows no `TELEGRAM_BOT_TOKEN` value.
- [ ] All 7 CTAs swapped; zero remaining `/#contact` or `/#inquiry` references.
- [ ] `.env.example` committed; `.env.local` ignored.
- [ ] PR/commit body documents VPS env-var setup and `pm2 restart --update-env` requirement.
- [ ] No file in the bounded context exceeds 200 LOC; no function exceeds 50 LOC (after extraction if needed).
- [ ] No high-priority risk left unaddressed.
