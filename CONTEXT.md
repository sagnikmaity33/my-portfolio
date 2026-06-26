# Sagnik Maity Portfolio — Project Context

## Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v3, PostCSS, Autoprefixer
- **Animations:** Framer Motion v11
- **Lottie:** @lottiefiles/dotlottie-react
- **Icons:** lucide-react

## Project Structure

```
/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout: fonts, metadata, providers, cursor effects
│   │   ├── page.tsx            # Single-page portfolio (Hero, About, Experience, Projects, Skills, Contact)
│   │   ├── globals.css         # Tailwind base + custom CSS (light/dark theme, timeline, buttons)
│   │   ├── CursorTrail.tsx     # Mouse cursor trail particles (emerald dots)
│   │   ├── CursorDust.tsx      # Mouse cursor dust particles (emerald dots)
│   │   ├── icon.jpg            # Favicon/OG image
│   │   ├── api/send-email/
│   │   │   └── route.ts        # POST /api/send-email — contact form handler
│   │   └── hooks/
│   │       ├── useMagnetic.ts  # Magnetic hover effect hook
│   │       └── useMagnetic.ts  # Duplicate empty file (hooks.useMagnetic.ts — likely a mistake)
│   ├── components/
│   │   ├── BackToTopButton.tsx # Floating back-to-top button
│   │   └── notification/
│   │       └── NotificationProvider.tsx  # Toast notification context + UI
│   ├── data/
│   │   └── content.ts          # All content: profile, skills, experiences, projects, awards
│   └── lib/
│       └── sanitize.ts         # Input sanitization utilities (subject, message, name, email)
├── public/
│   ├── fonts/InterVariable.woff2
│   ├── sagnik-resume_oct.pdf  # Resume download
│   ├── site-icon.png, icon1 (2).png, icon.jpg, freepik_logo.png
│   ├── *.svg, *.png            # Social icons (github, linkedin, gmail)
│   ├── Businessman With Mobile.mp4
│   └── file.svg, globe.svg, window.svg, next.svg, vercel.svg
├── .github/workflows/deploy.yml  # CI/CD: build + FTP deploy to Hostinger
├── next.config.ts
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.mjs
├── tsconfig.json
├── .gitignore
├── package.json
├── CONTEXT.md                   # This file
└── README.md
```

## Page Structure (all in `page.tsx`, single page)
| Section | Component | Description |
|---------|-----------|-------------|
| Navbar | `Navbar()` | Sticky header, scroll progress bar, mobile menu, theme toggle (commented out), referral support |
| Hero | `Hero()` | Typing animation (name, roles, description), Lottie animation card, resume download, quick links |
| About | `About()` | System glow bg, stats cards (10M+ events, 100+ nodes), core stack tags |
| Experience | `ExperienceSection()` | Alternating timeline with scroll-tracking animated line + orb, Framer Motion 3D hover |
| Projects | `ProjectsSection()` | Grid of project cards with expand/collapse, preview images, GitHub/demo links |
| Skills | `SkillsSection()` | Rotated marquee rows of skill pills with glass hover effect |
| Contact | `ContactSection()` | Dual-mode form (Message / Referral), Turnstile CAPTCHA, file upload, Resend email API |
| Footer | `Footer()` | Copyright + roles |

## Key Dependencies (from package.json)

### Production
- `next` ^16.2.4
- `react` ^18.3.1, `react-dom` ^18.3.1
- `framer-motion` ^11.0.0
- `@lottiefiles/dotlottie-react` ^0.8.12
- `lucide-react` ^0.577.0
- `resend` ^4.8.0 (email sending)
- `@upstash/redis` ^1.34.3 (rate limiting)
- `zod` ^4.3.6 (validation)
- `script` ^0.0.12 (unused? — used for `Script` import from next/script, but also listed as dep)

### Dev
- TypeScript v5, TailwindCSS v3, PostCSS, Autoprefixer
- ESLint v9 with `eslint-config-next`
- `@types/react` v19, `@types/react-dom` v19, `@types/node` v20

## Environment Variables Required (.env.local)
```
# Resend (email)
RESEND_API_KEY=
RESEND_FROM_ADDRESS=

# Cloudflare Turnstile (CAPTCHA)
NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=
CLOUDFLARE_TURNSTILE_SECRET_KEY=

# Upstash Redis (rate limiting)
TT_KV_REST_API_URL=
TT_KV_REST_API_TOKEN=

# Optional
RATE_LIMIT_WINDOW_SECONDS=3600
RATE_LIMIT_MAX_REQUESTS=3
DAILY_MAIL_QUOTA=50
CORS_ALLOWED_ORIGINS=https://sagnikmaity.in
MAIL_LATENCY_LOGS=false
NEXT_PUBLIC_MAIL_ENABLED=true
```

## Deviations & Notes
- **`src/app/hooks.useMagnetic.ts`** — empty file, likely a typo; `src/app/hooks/useMagnetic.ts` is the real one
- **Light/dark theme** — implemented in CSS but the theme toggle button in `Navbar` is commented out; theme defaults to dark
- **AwardsSection** — fully commented out in page.tsx (but data exists as empty array)
- **Typing animation** — old commented-out versions remain alongside new working versions in `Hero`
- **Deployment** — GitHub Actions FTP-deploys `./out/` (static export) to Hostinger via `npm run build` (note: `next export` is deprecated in Next.js 14+ — static export is done via `output: 'export'` in `next.config.ts`, which is not configured yet)
- **Preview images** — all projects use `preview:"#"` (placeholder), no actual images

## Scripts
| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run export` | (deprecated — was `next export`) |
