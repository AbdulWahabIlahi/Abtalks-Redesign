# ABTalks — Redesign

> Learn, build, and accelerate your career through **visible proof of work** — for India's coding community.

![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-13-0055FF?style=flat-square&logo=framer&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7-CA4245?style=flat-square&logo=reactrouter&logoColor=white)

---

## About

ABTalks is a community platform where college students **learn daily, build in public, and get hired through visible proof of work**. This repository contains a full redesign of the product — a single-page marketing site, a personal dashboard, and an interactive day-challenge page — built with a consistent dark-first design system.

The product runs several public programs, all revolving around shipping real work every day:

| Program | Status | Cadence |
| --- | --- | --- |
| 60-Day Coding Challenge | Enrolling now | One real task per day |
| Vibe Code Hackathon | Registration closed | 48-hour build sprint |
| 31 Days AI Cohort | Applications open | Ship a production AI chatbot |
| Claude Challenge | New | Prompt-engineering mastery |

---

## Features

- **Landing page** — hero with word-by-word title reveal, animated perspective grid background, live program cards, "How it works" steps, community CTA, and a snap-scroll testimonial carousel
- **Dashboard** — hackathon countdown (self-hosted DSEG7 LED font), streak tracker, progress ring, team roster, submission checklist, and event timeline
- **Day challenge page** — task brief, acceptance criteria checklist, collapsible hints, and a full submission flow with URL validation, success overlay, and localStorage persistence
- **Signature motion** — `PerspectiveGrid` (hover-reactive 3D tile background), `TextGenerateEffect` (scroll-triggered word reveal), `MagneticButton` (cursor-following springs), and `CountUp` stats
- **Accessibility** — every animation respects `prefers-reduced-motion` via a global `MotionConfig`

---

## Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | React 19 + TypeScript |
| Build tool | Vite 8 |
| Styling | Tailwind CSS 3 with a tokenized design system |
| Animation | Framer Motion 13 |
| Routing | React Router 7 |
| Primitives | Radix UI (badge, button, card, dialog, dropdown-menu, progress, tabs) |
| Icons | lucide-react + inline brand SVGs |
| Fonts | Plus Jakarta Sans, Inter, IBM Plex Mono, Orbitron (Google Fonts) · DSEG7 Classic (self-hosted) |

---

## Project Structure

```
├── public/
│   ├── abtalks.ico          # brand logo (favicon + in-app logo)
│   ├── favicon.svg          # legacy icon
│   └── fonts/               # self-hosted DSEG7 Classic woff2
└── src/
    ├── components/
    │   ├── ui/              # shadcn-style primitives
    │   ├── CountUp.tsx      # in-view animated counters
    │   ├── MagneticButton.tsx
    │   ├── PerspectiveGrid.tsx
    │   ├── SocialIcons.tsx  # Instagram / LinkedIn / YouTube / X / Discord
    │   └── TextGenerateEffect.tsx
    ├── pages/
    │   ├── LandingPage.tsx  # /
    │   ├── DashboardPage.tsx# /dashboard
    │   └── DayPage.tsx      # /day/12
    ├── lib/utils.ts         # cn() helper
    ├── App.jsx              # router + MotionConfig
    └── index.css            # design-system tokens & utilities
```

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Open the app
#    http://localhost:5173
```

### Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run lint` | ESLint over the source |
| `npm run preview` | Preview the production build locally |

---

## Design System

The app is **dark-only** and token-driven via CSS custom properties:

| Token | Value |
| --- | --- |
| Background | `#000000` |
| Foreground | `#FAFAFA` |
| Primary / accent | `#7364E6` |
| Highlight | `#C4B5FD` |
| Gradient accent | `#8B5CF6 → #6366F1 → #EC4899` |

Reusable utilities include `.glass-card`, `.gradient-text`, `.bg-grid`, `.bg-dots`, `.font-digital`, and elevation shadows. Global motion rules disable animation for users who prefer reduced motion.

---

## Routes

| Route | Page |
| --- | --- |
| `/` | Marketing / landing page |
| `/dashboard` | Signed-in dashboard |
| `/day/12` | Day 12 challenge page |
