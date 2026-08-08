# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page marketing/brand site for **The Hair Direction Salon** (Kamla Nagar, Delhi) — an editorial, animation-heavy landing page with a front-end-only booking flow. It is one package (`@workspace/hair-direction-salon`) inside a larger pnpm-workspace monorepo rooted two levels up at `Hair-Direction-Salon/`.

## Commands

Run from this package directory (`artifacts/hair-direction-salon`):

- `pnpm dev` — Vite dev server on port 3000, host 0.0.0.0
- `pnpm build` — production build to `dist/public`
- `pnpm serve` — preview the production build
- `pnpm typecheck` — `tsc --noEmit` (there is no test suite, no linter)

From the monorepo root you can instead use `pnpm --filter @workspace/hair-direction-salon run <script>`. Root-level `pnpm run typecheck` / `pnpm run build` cover all workspace packages.

## Architecture

**Two apps, one bundle, chosen at runtime by URL.** `src/main.tsx` inspects `window.location.pathname`:
- `/studio*` → lazy-imports `StudioApp` and mounts the embedded **Sanity Studio** (CMS admin).
- everything else → mounts `App` (the marketing site).

There is no client-side router library driving pages; the marketing site is a single scrolling document with in-page anchor navigation (`#home`, `#services`, `#gallery`, etc.). `wouter` is installed but not the primary nav mechanism.

**`src/App.tsx` is the whole marketing site** (~1000 lines, single file). All content — service `groups`, `featured` items, `reviews`, contact details — is **hardcoded as module-level constants**, not fetched. The booking form is UI-only: submit just flips local state to a confirmation; nothing is sent anywhere.

**Sanity CMS is set up but NOT yet wired to the front end.** `sanity.config.ts` (projectId `7yv1koun`, dataset `production`, basePath `/studio`) plus schemas in `src/sanity/schemaTypes/` (`homepage`, `service`, `page`) define a content model that mirrors the hardcoded data — but `App.tsx` does not query Sanity. Connecting the site to Studio content is the natural direction of this work; when doing so, the schemas are the source of truth for shape.

**Animation is core, not decoration.** `App.tsx` uses **GSAP + ScrollTrigger** for scroll-driven reveals/pinning/parallax and **Lenis** (`SmoothScroll` wrapper) for smooth scrolling. Conventions to preserve:
- Every animation is guarded by `reducedMotion()` — respect `prefers-reduced-motion` in any new effect.
- GSAP setup lives in `useLayoutEffect` inside a `gsap.context(...)` scoped to `siteRef`, with `context.revert()` on cleanup. Follow this pattern so triggers are torn down correctly.

## Styling

- **Tailwind CSS v4** via the Vite plugin (`@tailwindcss/vite`) — configured in `src/index.css`, no `tailwind.config.js`.
- `src/index.css` also holds the site's **hand-written CSS** (custom classes like `.hero`, `.service-group`, `.booking-modal`, CSS custom properties like `--champagne`). The marketing site is styled mostly with these bespoke classes, not Tailwind utilities.
- **shadcn/ui** ("new-york" style) components exist under `src/components/ui/`, but the marketing page does not use them — they are scaffolding available for future UI. `components.json` governs shadcn generation.
- Path alias: `@/*` → `src/*` (set in both `vite.config.ts` and `tsconfig.json`).

## Monorepo conventions

- Many dependency versions come from the workspace **pnpm catalog** (`catalog:` in `package.json`, defined in `../../pnpm-workspace.yaml`) rather than pinned here. Prefer `catalog:` for shared deps.
- `tsconfig.json` extends `../../tsconfig.base.json` and references `../../lib/api-client-react` (`@workspace/api-client-react`).
- The root `pnpm-workspace.yaml` enforces a **1-day minimum release age** on npm packages as supply-chain defense — do not disable it.
- `.replit-artifact/artifact.toml` defines how the platform runs/builds this artifact (dev = `pnpm ... run dev`, production build serves `dist/public` statically with SPA rewrite to `index.html`).

Note: the monorepo-root `replit.md` describes a generic API-server template and does **not** apply to this static front-end package.
