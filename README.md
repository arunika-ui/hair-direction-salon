# Hair Direction Salon — Booking & E-commerce Platform

Website, appointment booking and online shop for **Hair Direction**, a hair salon, built as a freelance client
project. Salon staff manage services, products, gallery and bookings themselves through an embedded CMS, and
customers pay online with Razorpay.

**Live:** [thehairdirectionsalon.com](https://thehairdirectionsalon.com)

![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![Sanity](https://img.shields.io/badge/Sanity_CMS-F03E2F?logo=sanity&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-0C2451?logo=razorpay&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000?logo=vercel&logoColor=white)

> **Role:** Sole developer and designer — requirements, UI/UX, front end, CMS, payments, deployment.

## Features

- **Appointment booking** — customers pick a service, date and time; each request is saved to the CMS
  with a status the salon team updates.
- **Online shop** — product catalogue with a cart drawer and **Razorpay** checkout.
- **Secure payments** — the browser sends only product IDs and quantities. Prices and the order total are
  always recalculated **server-side** from the CMS, and payments are confirmed by verifying Razorpay's
  **HMAC-SHA256 signature**, so a tampered cart or forged payment is rejected.
- **Self-service content** — services, prices, products, gallery and homepage are edited in an embedded
  **Sanity Studio**, so the client never needs a developer for content changes.
- **Polished motion** — GSAP and Lenis smooth scrolling, Framer Motion transitions.

## Architecture

```
Browser (React + Vite SPA)
  ├─ reads content ───────────────► Sanity CMS (services, products, gallery, pages)
  ├─ writes booking requests ─────► Sanity CMS (bookings, with status)
  └─ checkout ──► /api/create-order   (Vercel serverless: price from CMS → Razorpay order)
                  /api/verify-payment (Vercel serverless: HMAC signature check)
```

## Tech stack

| Area | Tools |
| --- | --- |
| Front end | React, TypeScript, Vite, Tailwind CSS, Radix UI / shadcn, Wouter, TanStack Query |
| Motion | GSAP, Lenis, Framer Motion |
| Content | Sanity CMS (embedded Studio) |
| Payments | Razorpay Orders API + webhook-style signature verification |
| Hosting | Vercel (static SPA + serverless functions) |
| Tooling | pnpm workspaces |

## Project structure

```
artifacts/hair-direction-salon/
  src/App.tsx              site, booking modal, cart drawer
  src/sanity/              CMS client and content schemas (service, product, booking, gallery, page)
  api/create-order.ts      server-side pricing + Razorpay order
  api/verify-payment.ts    payment signature verification
  vercel.json              SPA routing + API
lib/                       shared API client, schemas and types
```

## Run locally

```bash
pnpm install
pnpm --filter ./artifacts/hair-direction-salon run dev
```

Environment variables: Sanity project ID/dataset/token and `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`.

---

Built by [Arunika Jain](https://github.com/arunika-ui).
