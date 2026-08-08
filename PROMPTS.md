# PROMPTS LOG

## 2026-08-08 — Initial Project Setup & Design System

**Files Created/Modified:**
- `tailwind.config.js` — Full theme extension with CSS variables for colors, radii, fonts, shadows, gradients, animations
- `src/index.css` — Complete design system tokens (CSS custom properties) for both light and dark modes:
  - Fonts: Plus Jakarta Sans (headings), Inter (body), IBM Plex Mono (code), Orbitron (digital/timers)
  - Light mode tokens: gradient accent (violet→indigo→fuchsia), track colors (violet/indigo/amber), emerald CTA, glass cards, hover lift
  - Dark mode tokens: #000000 bg, #7364E6 primary, #C4B5FD highlight, zinc-400/500 muted, radial timer gradient (cyan→green→black)
  - Radii: rounded-3xl cards, rounded-xl/lg buttons/badges
  - Motion: prefers-reduced-motion respected globally
- `src/lib/utils.ts` — `cn()` helper (clsx + tailwind-merge)
- `src/lib/theme-context.tsx` — Theme provider with localStorage persistence, system preference detection, toggle function
- `src/components/ThemeToggle.tsx` — Animated sun/moon toggle with Framer Motion
- `src/components/ui/` — shadcn primitives: button, card, badge, dropdown-menu, dialog, tabs, progress
- `src/pages/LandingPage.tsx` — Initial placeholder with hero, stats, theme toggle
- `src/pages/DashboardPage.tsx` — Initial placeholder (always dark)
- `src/pages/DayPage.tsx` — Initial placeholder (always dark)
- `src/data/mock.ts` — 60-day mock data, 4 tracks, user progress, badges
- `src/App.jsx` — Router setup with AnimatePresence transitions
- `index.html` — Updated with proper meta tags, theme-color, light class

**Decisions Made (Not Explicitly Specified):**
- Used `darkMode: 'class'` in Tailwind config for manual theme control via ThemeProvider
- Created custom CSS utility classes (`.glass-card`, `.gradient-text`, `.btn-primary`, etc.) in index.css rather than pure Tailwind for cleaner component code
- Added Framer Motion page transitions in App.jsx with AnimatePresence
- Used Orbitron from Google Fonts for digital/timer numbers (fallback to ui-monospace)
- Set up CSS variables as RGB values (e.g., `255 255 255`) for use with `hsl(var(--color))` pattern
- Added `prefers-reduced-motion` media query that disables all animations/transitions globally

## 2026-08-08 — Session Log: Setup Response Recorded

- The prior response completed the full scaffold (see "Initial Project Setup & Design System" above, written in the same session).
- Verified both `npm run build` and `npm run lint` pass cleanly.
- This file was created to maintain a prompt-by-prompt changelog.

## 2026-08-08 — Landing Page Rebuild + Light Mode Fix

**Root cause of light-mode breakage (PROBLEM 2):**
- The design-system step stored CSS variables as RGB triples (e.g. `--foreground: 26 26 26`, `--muted-foreground: 115 115 115`), but `tailwind.config.js` and `index.css` mapped them through `hsl(var(--x))`. In the modern `hsl(H S L)` syntax those triples are parsed as hue/saturation/lightness, not RGB — so light-mode `text-muted-foreground` resolved to `hsl(115 115 115)` = clamps to pure white (invisible on white bg), and `text-foreground` (`26 26 26`) became dark orange instead of near-black. Dark mode only worked by coincidence (low values clamp to black/white).
- **Fix:** changed every `hsl(var(--x))` → `rgb(var(--x))` in `tailwind.config.js` (colors map) and `index.css` (body bg/color, `* { border-color }`, new pattern utilities). Verified in compiled CSS: `border-color: rgb(var(--border)/.6)` and `background-color: rgb(var(--card)/.8)`.

**Files touched this pass:**
- `tailwind.config.js` — colors block switched to `rgb()`; full design-system config otherwise unchanged
- `src/index.css` — `rgb()` fixes; `.glass-card`/`.card-elevated` rewritten to spec classes `bg-card/80 border-border/60 backdrop-blur-md`; added `.bg-grid`, `.bg-dots`, `.text-balance` utilities; `text-wrap: pretty` on body
- `src/pages/LandingPage.tsx` — **fully rebuilt** with every field from the `/` data block
- `src/components/SocialIcons.tsx` — NEW inline SVG brand icons (Instagram, LinkedIn, YouTube, X, Discord) since lucide-react v1.30 removed brand icons
- `src/components/CountUp.tsx` — NEW Framer Motion in-view counter for stats
- `src/App.jsx` — wrapped app in `<MotionConfig reducedMotion="user">` so Framer Motion honors `prefers-reduced-motion`
- `index.html` — title "ABTalks | 60 Days Challenge", meta description "Build your coding habit. Get discovered.", added OG tags

**Landing page sections rendered (PROBLEM 1):**
- Header: logo → `/`, theme toggle, "Sign in" → `/login`
- Hero: pre-header "Build in public. Grow together." (pill badge), full headline with gradient span exactly on "Get noticed.", full subheadline, dual CTAs ("Start the challenge", "Join the community"), plus a glass "Day 12 of 60" proof-of-work card mock with streak badge + task list + progress bar, and an XP floating chip; background grid pattern + aurora blobs
- Stats bar: all 3 stats (10,000+ members / 500+ projects / 100+ hiring partners) with Users / FolderGit / Briefcase icons and animated counters
- Tracks: all 4 cards with every field — full description, status badge (Enrolling now / Registration closed / Applications open / New), duration, tags, CTA, color accent (violet / indigo / amber)
- How ABTalks Works: 3 steps with full copy, icons (GraduationCap / Code / Trophy), step numbers, dashed connector
- Community CTA: emerald gradient banner, headline + subtext + "Join now" → WhatsApp link, blur circles + grid overlay
- Testimonials: all 9, full quotes (no truncation), correct names, roles (Lakshay & Devpal Singh Anand fall back to "ABTalks community member"), initials avatars, 5-star rows, snap-scroll carousel with prev/next buttons (desktop + mobile)
- Footer: brand, tagline, all 5 social links with icons, support email team@abtalks.in

**Decisions made (not explicitly specified):**
- Used `bg-card/80 border-border/60 backdrop-blur-md` verbatim for glass cards (spec's stated classes) instead of the earlier custom `--card-bg` vars
- Added a hero visual (proof-of-work card mock) for density since the spec gave no hero image
- Used initials avatars with cycling gradients instead of the `/testimonials/*.webp` paths (files don't exist yet; avoids broken images — swap in `<img>` later)
- Testimonials use a snap-scroll carousel with explicit prev/next buttons; stars added as supporting visual
- Kept `/login`, `/challenges`, `/program`, `/claude-signup` as links (routes not built yet in this pass)
- Verified: `npm run build` and `npm run lint` both pass.

## 2026-08-08 — Blank Page Fix + Theme System Removal

**Root cause of blank home page:**
- The `ThemeProvider` (`src/lib/theme-context.tsx`) read `localStorage` on mount. In sandboxed iframes (typical of hackathon preview panes) `localStorage` access throws a `SecurityError`, which crashed the entire React tree before anything rendered.
- Two additional latent blank-page risks: the outer `motion.div` in `App.jsx` started at `initial={{ opacity: 0 }}` (whole page invisible if the entrance animation never completes), and `<AnimatePresence mode="wait">` wrapped an unkeyed `<Routes>` (can hang waiting for an exit that never fires).

**Theme system removed (per request — app is now always dark):**
- Deleted `src/lib/theme-context.tsx` and `src/components/ThemeToggle.tsx`
- `src/index.css` — moved all dark token values into `:root` (always applied); deleted the `.light` and `.dark` blocks and the now-unused `--card-bg` / `--card-border` variables
- `index.html` — `<html class="dark">` is now permanent; removed the light `theme-color` meta; added `color-scheme: dark`
- `tailwind.config.js` — unchanged (still `darkMode: 'class'`, which now activates `dark:` variants via the permanent `dark` class on `<html>`)
- `src/App.jsx` — removed `ThemeProvider`, `AnimatePresence`, and the opacity wrapper; kept `MotionConfig reducedMotion="user"` + plain `Routes`
- `src/pages/LandingPage.tsx`, `DashboardPage.tsx`, `DayPage.tsx` — removed the toggle button and its import
- `src/components/ui/card.tsx` — was still referencing the deleted `--card-bg`/`--card-border` vars; switched to `bg-card/80 border-border/60 backdrop-blur-md`
- `DashboardPage.tsx` — repaired a JSX tag imbalance left over from the toggle removal

**Verification:**
- `npm run build` and `npm run lint` both pass.
- Dev server boots cleanly; `<html>` carries `class="dark"`; App/LandingPage modules transform without errors; zero remaining `ThemeToggle`/`theme-context` references.

## 2026-08-08 — Session Log: PROMPTS.md Maintenance

- The previous response (documented in "Blank Page Fix + Theme System Removal" above) was purely a changelog update: it appended that entry to this file. No source files were touched in that pass.
- This session continues with the `/dashboard` rebuild from the full hackathon data block.

## 2026-08-08 — Dashboard Rebuild (Full Data Block)

**Files modified/created:**
- `src/pages/DashboardPage.tsx` — **fully rebuilt** from the hackathon data block; every section rendered completely (see section map below)
- `src/index.css` — added `@font-face` for `'DSEG7 Classic'` (self-hosted); `--font-digital` now `'DSEG7 Classic', 'Orbitron', ui-monospace, monospace`
- `public/fonts/DSEG7Classic-Regular.woff2` — NEW self-hosted LED-style timer font (5.2 KB), vendored from the open-source `dseg@0.46.0` npm package (not on Google Fonts)
- `PROMPTS.md` — this entry

**Dashboard sections rendered (every field from the brief):**
- Header: ABTalks logo → `/`, sticky, blur backdrop; avatar dropdown signed-in with initial `I`, email `ilahiwahab@gmail.com`, online dot, Dashboard / Profile & settings / Sign out
- Welcome: "Welcome, Wahab" + NEXORA uppercase pill badge
- Countdown card: radial cyan→green→black gradient, ghost "88" behind live DSEG7 digits, 4 groups (DAYS/HRS/MIN/SEC) targeting Sun 9 Aug · 8:00 PM IST, "Time's up" state when elapsed
- Streak card (hero) + 7-day strip: Mon–Thu done, Fri missed (rose), Sat today (ring + violet), Sun upcoming; "N days" flame badge; zero-streak encouraging copy
- Progress card + SVG ring: 1 of 3 submission items → 33% "ready"
- Breeth Pro sponsor card: full description, "run one test write before kickoff" instruction, primary CTA + "Quickstart and MCP setup →" secondary link
- Challenge module: "Three Problem Statements are now available." + "Check Problem Statements" CTA
- Team roster (NEXORA · 3/3): Ratan Kumar/Leader/ABES/RK, Rashi Pathak/Member/ABES/RP, Wahab Ilahi/Member/WI; empty-roster state
- Submission checklist: 3 items with full descriptions + per-item Done/Pending badges + progress bar + "Submit these on the submission page →"
- Event timeline: vertical stepper, Kickoff / Midpoint check-in / Deadline / Results with full copy + dates + WhatsApp group CTA

**Data invented (not in the brief — flagged for confirmation):**
- Streak strip values + count (Mon–Thu done, Fri missed, Sat today, Sun upcoming → streak 4) — the brief gave no per-day data
- Countdown target year assumed `2026-08-09T20:00:00+05:30` (brief says "Sunday 9 Aug · 8:00 PM IST", no year)
- Timeline dates: Kickoff Fri 7 Aug, Deadline Sun 9 Aug, Results Fri 14 Aug (from brief); Midpoint shown as "Optional · during the weekend" (exact date not in brief)
- Sponsor + submission links are `#` placeholders (no URLs provided); WhatsApp group link is real (`chat.whatsapp.com/LSru1BgvifpEB4OMZsaZEi`)
- Logo mark is a gradient TrendingUp square (no logo asset); user avatar initial `I` per brief, name/email derived from the brief's signed-in state

**Edge cases re-confirmed (per request):**
- Zero streak → "No streak yet — start today and make it Day 1." framing
- Missed day → rose-styled dot + "Missed day" tooltip, visibly distinct from done/today/upcoming
- Incomplete profile → `{user.name || 'ABTalks builder'}` fallbacks + amber "Complete your profile" hint in dropdown

**Verification:**
- Fixed a `React.ReactNode` reference (React wasn't imported) → `import { ..., type ReactNode }`
- `npm run build` and `npm run lint` both pass.
- `/` (LandingPage) and `/day/12` (DayPage) untouched this pass.

## 2026-08-08 — Day 12 Page Rebuild

**Scope decision:** `/day/12` is now the ONLY day route. `src/App.jsx` route changed from `/day/:id` to a static `/day/12`; no prev/next navigator, no other day data. `/` and `/dashboard` untouched.

**Files touched:**
- `src/pages/DayPage.tsx` — **fully rebuilt** (~1,040 lines), replacing the old placeholder (useParams, fake React Hooks content, tabs/timer/notes, prev/next links)
- `src/App.jsx` — route `path="/day/12"` (single edit; all else unchanged)
- `PROMPTS.md` — this entry

**Page structure (mobile-first, 390px; dark tokens only):**
- Sticky header: Back → `/dashboard`, ABTalks logo → `/`, right-aligned `12/60` mono pill
- Hero: `Day 12 / 60` (DSEG font + flame), three pills (AI Engineering / Medium / 60–90 min), H1 title, 3-sentence task brief, "Why this matters" callout — brief/why animate in on scroll (whileInView, once, reduced-motion safe)
- Acceptance criteria: 5 checkable items with custom gradient checkboxes (whole row is the tap target for touch), staggered scroll-in, `n of 5` live counter — interactive but doesn't gate submission
- Hints: collapsible "Stuck? Open a hint" with 3 spoiler-safe nudges
- Submission card (gradient glow, consistent with dashboard modules): live URL validation, submit button, full state machine
- Dev panel (dashed border, mono `DEV` label) at the bottom to preview the three states + reset

**Functionality:**
- GitHub validation `GITHUB_RE`: `github.com/<user>/<repo>` optionally `/commit|blob|tree|releases/tag/<path>`; LinkedIn validation `LINKEDIN_RE`: `linkedin.com/posts/… | /feed/update/urn:li:activity:… | /embed/feed/update/…` (profiles `/in/` correctly rejected). Error shown on blur only (no red flash while typing); green BadgeCheck + hint text appear the instant a field becomes valid; both are required before submit enables
- Submit → 1.3s loading spinner → full-screen success overlay (SVG check morph via pathLength, spring ring, 18-particle Framer Motion confetti, both gated on `useReducedMotion` for prefers-reduced-motion) → auto-transitions to submitted state
- Submitted state: read-only GitHub + LinkedIn link rows (inline brand SVGs, ExternalLink icons), "Submitted · <time>" line, **Edit submission** (returns to pre-filled form, button says "Update submission"), Back to dashboard
- Missed state: amber/CalendarX warning card — honest, non-punitive copy ("won't count toward your streak — but the skill still matters"), **Practice it on my own** reveals the same form in practice mode (success overlay says "Day 12 practiced", NOT persisted, returns to missed view with a green "You practiced this day" ribbon), plus Back to dashboard
- Persistence: submission saved to `localStorage` (key `abtalks.day12.submission`) wrapped in try/catch so sandboxed iframes degrade to in-memory state (same failure mode as the old ThemeProvider); reload restores the submitted state

**Task content invented (no data existed for this page):**
- Chose **AI Engineering** track + task **"Build a tiny RAG search over your own notes"** — rationale: RAG is the most-cited AI-interview skill, it fits the vibe-code hackathon theme and the Breeth memory-layer sponsor, and it lets a Day-12 student ship something demonstrable without heavy infra. (Old mock.ts tracks — Frontend/Backend/Full Stack/System Design — were ignored as stale placeholder data.)
- All 5 acceptance criteria written to be concretely verifiable (≥10 docs indexed with source refs, ranked `/search` with scores, grounded `/ask` with a documented "I don't know" threshold, 400 on bad input, runnable README) — mirrored the "429 + Retry-After" specificity bar from the prompt
- Estimates: 60–90 min, difficulty Medium; hints written to not give away the answer
- Simulated "missed" scenario is dev-only (no real day-close logic exists); "submitted" simulates persistence via localStorage

**Verification:** `npm run build` and `npm run lint` both pass. (Fixed JSX-text `\uXXXX` escapes that would have rendered literally by replacing them with real Unicode chars — `—`, `’`, `·`, `…`.)

## 2026-08-08 — Perspective Grid Home Background

**Files touched:**
- `src/components/PerspectiveGrid.tsx` — NEW (adapted from the shadcn/magicui-style component the user pasted)
- `src/pages/LandingPage.tsx` — imported `PerspectiveGrid`; wrapped the page in a `relative` container, added `<div className="fixed inset-0 z-0"><PerspectiveGrid /></div>`, and lifted `Header`/`main`/`Footer` into a `relative z-10` wrapper so content sits above the grid
- `PROMPTS.md` — this entry

**What it does:** A full-viewport 3D "perspective tunnel" background — a 40×40 grid of tiles transformed with `rotateX(30deg) rotateY(-5deg) rotateZ(20deg) scale(2)` under a 2000px perspective. Tiles light up **violet on hover** (`#7364E6`) and slowly fade back (classic light-trail effect). A radial mask fades the grid to black at the edges, keeping centered content readable. Because the layer is `fixed`, the grid stays in place while the page scrolls and it glows through the semi-transparent glass cards — the hero's own `bg-grid` + aurora blobs still render on top.

**Decisions made (not explicitly specified in the request):**
- The pasted component had **no hover styling** on tiles (only `transition-colors duration-[1500ms] hover:duration-0`). Added `hover:bg-primary/20` so the hover effect actually produces a visible violet glow on the dark background; kept `duration-[1500ms] hover:duration-0` = instant light-on, 1.5s fade-out.
- App is dark-only, so removed the light-mode branches: root is `bg-black` and `--fade-stop:#000000` instead of `bg-white dark:bg-black` / `#ffffff` fallback.
- Changed `import { cn } from "@/lib/utils"` → relative `../lib/utils` (no `@` alias configured in this project) and dropped the `"use client"` directive (Next.js-specific no-op in this Vite SPA).
- Grid lines toned to `border-white/[0.05]` for a subtle trace on black.
- Kept `gridSize` default of 40 (1,600 tiles) and the `showOverlay`/`fadeRadius` API intact.
- `pointer-events-none` on the overlay means the tile hover still fires through it.

**Verification:** `npm run build` and `npm run lint` both pass. `/dashboard` and `/day/12` untouched this pass.

## 2026-08-08 — Ascii Glitch Ripple on Hero (Minimalist)

**Files touched:**
- `src/components/AsciiGlitchRipple.tsx` — NEW (adapted from the magicui-style component the user pasted)
- `src/pages/LandingPage.tsx` — imported `AsciiGlitchRipple`; applied it to the hero headline's key value prop with a justification comment
- `PROMPTS.md` — this entry

**Placement (deliberately ONE, per "when in doubt, leave it static"):**
- Only the hero H1's emphasis phrase **"Get noticed."** (the gradient span) ripples on hover. The two static lines "Code consistently. Post publicly." stay untouched to preserve typographic hierarchy and readability. Added `aria-label="Get noticed."` so screen readers ignore the transient scrambled `textContent`.

**What it does:** On hover/move over the phrase, an ASCII "glitch" wave ripples out from the cursor (chars scramble in a ring, then settle back to the real text). `preserveSpaces` keeps spacing stable; the component locks the element's pixel width during animation so there is zero layout shift.

**Decisions made (not explicitly specified):**
- **Single placement** — the strongest value prop on the most-visited screen; no section headings, nav, pills, body copy, or functional elements animated.
- **Added a `prefers-reduced-motion` guard** inside the component (new, vs. the paste): if the OS requests reduced motion, listeners are never attached and the element stays static. Hover-driven effects also naturally don't fire on touch/mobile.
- Dropped `"use client"` (Next-specific no-op in this Vite SPA) and switched `@/lib/utils` → `../lib/utils` (no alias in this project). Kept the rest of the pasted logic unchanged.
- `aria-label` on the usage site keeps the animated element accessible despite `textContent` mutation.

**Verification:** `npm run build` and `npm run lint` both pass. `/dashboard` and `/day/12` untouched this pass.

## 2026-08-08 — Glitch Ripple Extended Across All Pages (Subtle)

**Files touched:**
- `src/pages/LandingPage.tsx` — 4 more placements
- `src/pages/DashboardPage.tsx` — import + 2 placements
- `src/pages/DayPage.tsx` — import + 1 placement
- `src/components/AsciiGlitchRipple.tsx` — dropped `cursor-pointer` from the base classes (none of the placements are clickable; a pointer cursor would falsely suggest interactivity)
- `PROMPTS.md` — this entry

**New placements (all small, secondary, hover-only; main-focus text left static):**
- Landing — hero eyebrow pill "Build in public. Grow together."
- Landing — section eyebrows via `SectionHeading` ("Programs", "How it works", "Testimonials"); the section titles themselves are never animated
- Landing — hero proof-of-work card "Day 12 of 60"
- Landing — "How ABTalks Works" step numerals (01 / 02 / 03)
- Dashboard — NEXORA team pill next to the greeting (the greeting "Welcome, Wahab" stays static)
- Dashboard — "Time left to submit" helper label above the countdown (the DSEG digits stay untouched)
- Day — "Day 12" tag in the font-digital eyebrow above the task title (the task title itself is untouched)

**Rules kept from the previous pass:** every placement is non-primary text (eyebrows, pills, module labels, decorative numerals); every usage sets `aria-label` to the true string so the scrambled `textContent` is invisible to screen readers; `preserveSpaces` + width-locking prevent layout shift; hover-driven so touch/mobile and reduced-motion users see plain static text.

**Verification:** `npm run build` and `npm run lint` both pass.

## 2026-08-08 — Glitch Ripple Removed (Reverted)

**Files touched:**
- `src/components/AsciiGlitchRipple.tsx` — DELETED (component file removed)
- `src/pages/LandingPage.tsx` — reverted all 5 placements (hero "Get noticed." gradient span, hero eyebrow pill, `SectionHeading` eyebrows, proof-card "Day 12 of 60", step numerals) back to plain static text; import removed
- `src/pages/DashboardPage.tsx` — reverted NEXORA pill and "Time left to submit" label to static text; import removed
- `src/pages/DayPage.tsx` — reverted "Day 12" eyebrow tag to static text; import removed
- `PROMPTS.md` — this entry

**Verification:** zero `AsciiGlitchRipple` references remain; `npm run build` and `npm run lint` both pass. All three pages now render the original static text exactly as before the animation was added. The `PerspectiveGrid` background (still on the landing page) is unaffected.

## 2026-08-08 — TextGenerateEffect on Landing Page Titles (Combined Log)

*Two consecutive passes consolidated into one entry per request: (1) built the component + applied it to the hero and section headings; (2) confirmed coverage of the two headings the user re-named ("How ABTalks Works", "Pick a track, ship every day").*

**Files touched:**
- `src/components/TextGenerateEffect.tsx` — NEW (adapted from the magicui-style component the user pasted)
- `src/pages/LandingPage.tsx` — hero H1 now renders directly through `TextGenerateEffect`; the shared `SectionHeading` component wraps every `title` in `TextGenerateEffect`, so all three section headings (including the two re-named ones) are animated by the same change; import added
- `PROMPTS.md` — this combined entry

**What it does:** Word-by-word reveal — each word starts `opacity-0` with `blur(10px)` and resolves to full opacity / `blur(0px)` with a `stagger(0.2)` delay. Runs when the title scrolls into view (not on mount), once. The hero H1 keeps its gradient on "Get noticed." via a `highlightWords` prop; section titles are plain white.

**Coverage (all main titles):**
- Hero H1 — "Code consistently. Post publicly. Get noticed." with "Get" + "noticed." gradient-matched
- "Pick a track, ship every day" (Programs section)
- "How ABTalks Works" (How it works section)
- "What our builders say" (Testimonials section)

**Adaptations vs. the paste (all deliberate):**
- Remapped `motion/react` → `framer-motion` (this project's package; verified `motion`, `stagger`, `useAnimate`, `useInView`, `useReducedMotion` all exported) and `@/lib/utils` → `../lib/utils` (no alias configured).
- **Scroll-triggered instead of mount-only** — replaced the paste's `useEffect([scope.current])` (buggy dep) with `useInView(scope, { once: true, margin: '-60px' })` + a stable effect, so section headings reveal when they enter the viewport rather than all animating at page load.
- **Reduced-motion guard** — when `prefers-reduced-motion` is set (or `MotionConfig reducedMotion="user"` kicks in), words render fully visible/static (no `opacity-0`, no blur) and the animation never runs, so text can never be stuck invisible.
- **Fixed the `filter` animation target** — animating `filter` to `"none"` isn't interpolatable in framer-motion; when `filter` is false the effect now animates opacity only, and the start-state blur is skipped too.
- **Dark-only + flexible sizing** — collapsed `dark:text-white text-black` → `text-white`; dropped the paste's hardcoded `mt-4 text-2xl leading-snug tracking-wide` wrappers so the component is a drop-in inline `<span>` that inherits the h1/h2 typography it sits inside. Words are `inline-block` with `\u00A0` separators so blur/clip render cleanly and text never reflows mid-animation.

**Placement (restraint kept):** hero H1 + the three `SectionHeading` titles only. **Not animated:** hero eyebrow pill, the community banner H2 (already has its own motion + a saturated emerald bg where blur-in reads poorly), subheadlines, card titles, nav, and functional elements.

**Verification:** `npm run build` and `npm run lint` both pass. `/dashboard` and `/day/12` untouched this pass.

## 2026-08-08 — Content Pass-Through Fix (Grid Hover + Clickable Buttons)

**Root cause:** the landing page's content wrapper used `pointer-events-none` so hovers would reach the fixed `PerspectiveGrid` behind it (z-0) and light the tiles. But `pointer-events` is an inherited property, so every descendant — including all links and buttons — inherited `none` and became unclickable.

**Files touched:**
- `src/index.css` — NEW `.content-layer` utility: `pointer-events: none` on the layer itself, but `pointer-events: auto` re-enabled for `a`, `button`, and `[role='button']` descendants
- `src/pages/LandingPage.tsx` — content wrapper class changed from `relative z-10 pointer-events-none` → `relative z-10 content-layer`
- `PROMPTS.md` — this entry

**Result:** hovering any non-interactive area (text, cards, whitespace) still passes through and animates the grid tiles behind the glass cards; all interactive elements (header logo/sign-in, hero CTAs, track-card CTAs, community banner "Join now", testimonial scroll buttons, footer logo/social/email links) are clickable again.

**Verification:** `npm run build` and `npm run lint` both pass. `/dashboard` and `/day/12` untouched this pass.

## 2026-08-08 — MagneticButton on Hero CTA + Community Banner

**Files touched:**
- `src/components/MagneticButton.tsx` — NEW (adapted from the magicui-style component the user pasted)
- `src/pages/LandingPage.tsx` — "Start the challenge" (hero) and "Join now" (community banner) wrapped in `MagneticButton`; import added
- `PROMPTS.md` — this entry

**What it does:** The button's inner content magnetically pulls toward the cursor (spring x/y up to `maxDistance`, `strength` 0.8). A dashed blue boundary ring + 20% blue tint appear around the button while it's being dragged, then fade out on mouse leave.

**Adaptations vs. the paste (all deliberate):**
- Remapped `motion/react` → `framer-motion` and typed it (`.tsx`): `children`/`className`/`strength`/`maxDistance` props, `useRef<HTMLDivElement>`, `MouseEvent<HTMLDivElement>`.
- **Fixed the undefined `var(--color-blue-500)`** — the paste referenced a Tailwind var that doesn't exist in this project, so the ring/tint would never show; replaced with a literal `#3b82f6` via `[--show-color:#3b82f6]`.
- **`pointer-events-auto` on the wrapper** — required under the `.content-layer` pass-through (which only re-enables `a`/`button`/`[role='button']`): without it the wrapper is a plain `div` and would inherit `pointer-events: none`, silently killing the magnetic tracking. Clicks still work since the inner `<a>`/`<Link>` keeps its own pointer events.
- **Reduced-motion guard** — `useReducedMotion()` short-circuits `handleMouseMove`, so the button never drifts and the ring never appears for `prefers-reduced-motion` users.
- Dropped `"use client"` (Next.js no-op in this Vite SPA).

**Layout decisions:** hero wrapper gets `w-full sm:w-auto` to preserve the responsive full-width-on-mobile / inline-on-desktop flex layout; community banner wrapper gets `mt-8 inline-block` (moved the old margin off the `<a>` so it centers under the emerald banner's `text-center` block without leaving empty space inside the dashed ring). The "Join the community" secondary hero button was intentionally **not** wrapped (user named only the two).

**Verification:** `npm run build` and `npm run lint` both pass. `/dashboard` and `/day/12` untouched this pass.

## 2026-08-08 — Real ABTalks Logo (abtalks.ico) Everywhere

**Files touched:**
- `src/pages/LandingPage.tsx` — header logo + footer logo: replaced the gradient `TrendingUp` square with `<img src="/abtalks.ico" … h-9 w-9 shrink-0 object-contain>`
- `src/pages/DashboardPage.tsx` — header logo: same swap at `h-8 w-8`; removed the now-unused `TrendingUp` lucide import
- `src/pages/DayPage.tsx` — header logo: same swap at `h-8 w-8`; removed the now-unused `TrendingUp` lucide import
- `index.html` — favicon link changed from `/favicon.svg` → `/abtalks.ico` (`type="image/x-icon"`)
- `PROMPTS.md` — this entry

**Decisions made (not explicitly specified):**
- The `.ico` is a 32×32 raster with baked-in transparency, so the old gradient background span / `rounded-xl` / `shadow-elevation-1` were dropped entirely — the image renders on its own with `object-contain`, and `shrink-0` prevents it from being squashed by the flex `items-center` row (perfect vertical alignment with the wordmark).
- Sizes match the previous marks exactly: `h-9 w-9` (36px) on the landing header/footer, `h-8 w-8` (32px, 1:1 pixel-perfect) on the dashboard/day headers.
- Left the hero proof-of-work XP chip's `TrendingUp` untouched — that's a decorative emerald badge, not the ABTalks logo.
- Left `public/favicon.svg` and `public/icons.svg` in place (unused by the app now); `abtalks.ico` already existed in `public/`.

**Verification:** `npm run build` and `npm run lint` both pass. All four logo sites + the browser tab favicon now use `abtalks.ico`.