# Implementation Plan: Crosswinds Band Site

## Phase 1 — Project Setup

1. Scaffold Astro project in repo root (`pnpm create astro@latest`)
2. Add Svelte integration (`pnpm astro add svelte`)
3. Add `js-yaml` for YAML content loading at build time
4. Add test dependencies: `pnpm add -D vitest @testing-library/svelte @testing-library/jest-dom playwright @playwright/test`
5. Configure `tsconfig.json` with strict mode

**Output:** runnable `pnpm dev` with empty pages

---

## Phase 2 — Design Tokens

Create `src/styles/tokens.css`:
- Color variables (`--color-bg`, `--color-text`, `--color-accent`, etc.) — source from `assets/color-samples.png`
- Spacing/size variables (`--nav-height`, `--section-gap`, `--player-width`, etc.)
- Font stack variable

Import globally via Astro layout.

---

## Phase 3 — Types & Content Loading

1. Create `src/types/content.ts` with interfaces from SPEC:
   ```ts
   Track, ContentItem, ContentDocument
   ```
2. Create `src/lib/content.ts`:
   - `getHomeContent(): ContentDocument`
   - `getTheBandContent(): ContentDocument`
   - Both load and parse the respective YAML files using `js-yaml`

---

## Phase 4 — Layout Components

### `src/components/TopBar.astro`
- Logo (left) linking to `/`
- Nav links: `Home`, `The Band`, `Contact Us` (right)
- `Contact Us` opens `ContactUsDialog` on click
- Mobile: hamburger icon toggles a dropdown nav (Svelte island for toggle state)

### `src/components/BottomBar.astro`
- Social media icon links (URLs: TBD — add placeholders)

### `src/layouts/Layout.astro`
- Wraps all pages with `TopBar`, `<slot />`, `BottomBar`
- Imports `tokens.css`

---

## Phase 5 — DemoPlayer Component

**`src/components/DemoPlayer.svelte`**

Controls:
- Skip back 15s
- Rewind to start
- Play/pause toggle
- Skip forward 15s
- Current time / duration display

Behavior:
- Starts paused; no autoplay
- Emits a custom `play` event so the page can stop other players
- Accepts props: `title: string`, `source: string`

Single-player coordination:
- Home and Band pages pass a shared `activePlayer` store (Svelte writable) down to each `DemoPlayer`
- On play, player sets itself as active; all others pause

---

## Phase 6 — InfoSection Component

**`src/components/InfoSection.svelte`**

Props: `item: ContentItem`, `flip: boolean`

Layout:
- Horizontal split: text+player side | photo side
- `flip` alternates which side is image vs. text (for even/odd sections)
- Text side: `title` (if present), `text`, and `DemoPlayer` (if `audio` is present)
- Image side: `<img>` from `item.photo`
- Responsive: stacks vertically on mobile (photo below text)

---

## Phase 7 — ContactUsDialog Component

**`src/components/ContactUsDialog.svelte`**

UI:
- Modal overlay; `X` closes it
- Fields: Name, Email, Message (textarea)
- Send button

Validation (on submit, before POST):
- Name ≥ 8 characters
- Email matches `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Message ≥ 12 characters
- Show per-field inline error if invalid

Submit flow:
1. Show spinner alongside `Send` text; wait minimum 1s and until response
2. On success: change button to `Sent!` + disabled state → close dialog after 2s
3. On error: show inline error below Send button; button reverts to `Send`; dialog stays open

Backend: `POST` to endpoint URL (currently TBD — use env variable `PUBLIC_CONTACT_ENDPOINT`)

---

## Phase 8 — Pages

### `src/pages/index.astro` (Home)
- Load `HomeContent` via `getHomeContent()`
- Render `InfoSection` for each item in `content[]`, with `flip` toggling per index
- Pass shared Svelte `activePlayer` store to coordinate DemoPlayer instances

### `src/pages/the-band.astro` (The Band)
- Load `TheBandContent` via `getTheBandContent()`
- Render `hero` as a full-width text block above sections
- Render `InfoSection` for each member in `content[]`, alternating flip

---

## Phase 9 — Polish

- Accessibility: focus trap in modal, `aria-label` on player buttons, `alt` on all images
- Mobile layout: verify hamburger nav, stacked InfoSection, full-width player
- Replace all `(TODO)` content placeholders in YAML files with real copy

---

## Phase 10 — Testing

### Unit tests — Vitest (`src/lib/*.test.ts`)
- Content loader: assert `getHomeContent()` and `getTheBandContent()` return valid `ContentDocument` shape
- Form validation: name < 8 chars, valid/invalid email regex, message < 12 chars edge cases
- DemoPlayer time logic: skip ±15s clamps correctly at 0 and duration
- Submit timing: spinner shown for minimum 1s; auto-close fires after 2s on success

### Component tests — Vitest + `@testing-library/svelte` (`src/components/*.test.ts`)
- `DemoPlayer`: title renders; play/pause toggle updates state; skip buttons adjust `currentTime`
- `ContactUsDialog`: per-field errors on invalid submit; Send disables + shows `Sent!` on success; inline error + Send reverts on backend error
- Single-player rule: starting one player pauses another via shared store

### E2E tests — Playwright (`e2e/`)
- Home page: all `InfoSection`s render; player plays and displays time
- The Band page: `hero` text appears above member sections; layout alternates correctly
- Contact modal: opens from top bar; validates fields; happy-path submit (mock endpoint via `page.route()`); error-path submit
- Mobile (375px viewport): hamburger opens nav; `InfoSection` stacks vertically

**Note:** Contact backend is TBD — use `page.route('**/contact', ...)` in Playwright to mock until real endpoint is available.

---

## Phase 11 — Deployment to GitHub Pages

1. Set `site` and `base` in `astro.config.mjs`:
   ```js
   site: 'https://crosswinds-jazz.github.io',
   base: '/',
   ```
2. Create `.github/workflows/deploy.yml`:
   - Trigger: `push` to `main`
   - Steps: checkout → `pnpm install` → `pnpm build` → deploy `dist/` with `actions/deploy-pages`
3. In GitHub repo settings: set Pages source to **GitHub Actions**
4. Verify deploy at `https://crosswinds-jazz.github.io`

**Note:** Audio and image files in `assets/` are served directly; no CDN needed for review purposes.

---

## File Structure (target)

```
src/
  components/
    TopBar.astro
    BottomBar.astro
    InfoSection.svelte
    InfoSection.test.ts
    DemoPlayer.svelte
    DemoPlayer.test.ts
    ContactUsDialog.svelte
    ContactUsDialog.test.ts
  layouts/
    Layout.astro
  lib/
    content.ts
    content.test.ts
  pages/
    index.astro
    the-band.astro
  styles/
    tokens.css
  types/
    content.ts
e2e/
  home.spec.ts
  the-band.spec.ts
  contact.spec.ts
  mobile.spec.ts
content/
  home.yaml
  the-band.yaml
assets/
  (photos, audio, logo)
.github/
  workflows/
    deploy.yml
```
