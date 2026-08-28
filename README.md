# Campus Portal — College Management System

A full-stack campus administration platform for **IIT Dholakpur**. It covers the public institute site and authenticated portals for students, faculty, and administrators — attendance, academics, results, notices, and campus resources in one application.

**Live:** [vector-phi-rosy.vercel.app](https://vector-phi-rosy.vercel.app/landingPage)

---

## Features

### Public site
- Institute landing page, about, courses, faculty directory, and contact
- Campus resources: academic calendar, library, placement cell, student portal, alumni
- SEO metadata, Open Graph tags, JSON-LD, `sitemap.xml`, and `robots.txt`

### Student portal
- Dashboard, timetable, courses, assignments, and results
- Attendance via QR scan or 6-digit session code
- Notices, messages, notifications, and profile settings

### Faculty portal
- Class roster, timetable, and assignment upload
- Live attendance sessions (QR + session code) and session records
- Results / marksheet workflows

### Admin portal
- Students, faculty, subjects, classes, and enrollment
- Academic management (semesters, promotions, bulk uploads)
- Attendance overview, notices, results, and system settings

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Database | MongoDB with Mongoose |
| Auth | JWT (HTTP-only cookie), Google OAuth |
| Media | Cloudinary |
| Email | Resend |
| Testing | Vitest |

---

## Getting started

### Prerequisites

- Node.js 20 or later
- npm
- A MongoDB database (local or Atlas)

### Install

```bash
git clone https://github.com/ajiteshkumar-017/Managment.git
cd manclg
npm install
```

### Configure environment

Create a `.env` file in the project root:

```env
# Required
MONGODB_URL=
JWT_SECRET=

# Site URL (canonical links, Open Graph, sitemap)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Google sign-in
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:3000/api/users/auth/google/callback

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_API_KEY=
NEXT_PUBLIC_CLOUDINARY_API_SECRET=

# Email (Resend)
RESEND_API_KEY=
EMAIL_FROM=
EMAIL_APP_URL=http://localhost:3000
CONTACT_TO_EMAIL=

# Optional
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
COLLEGE_NAME=IIT Dholakpur
SUPPORT_EMAIL=contact@iitdholakpur.edu
```

`JWT_SECRET` must be a long random string. Never commit `.env`.

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Unauthenticated visitors are sent to `/landingPage`.

| Role | Typical entry |
| --- | --- |
| Public | `/landingPage` |
| Student | `/dashboard` |
| Faculty | `/faculty/dashboard` |
| Admin | `/admin/dashboard` |

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm test` | Vitest in watch mode |
| `npm run test:run` | Vitest once (CI) |
| `node scripts/optimize-hero.mjs` | Rebuild compressed landing hero images |

For a realistic Lighthouse score, audit the production server (`npm run build && npm run start`), not `next dev`.

---

## Project layout

```
src/
  app/                 # App Router pages and API routes
    (app)/
      (users)/         # Public site + student portal
      faculty/         # Public faculty directory + faculty panel
      admin/           # Admin panel
    api/               # REST handlers
  components/          # Shared UI
  lib/                 # Auth, SEO, email, attendance rules
  models/              # Mongoose schemas
  services/            # Notifications and domain services
public/                # Static assets (including /hero WebP slides)
```

Route protection lives in `src/proxy.ts` (public prefixes vs student / faculty / admin panels).

---

## Testing

Unit tests live under `src/tests/`. Path aliases (`@/…`) are resolved in `vitest.config.mts`.

```bash
npm run test:run
```

---

## Deployment

The app is set up for **Vercel**.

1. Set the same environment variables in the Vercel project (use the production origin for `NEXT_PUBLIC_SITE_URL`, `EMAIL_APP_URL`, and `GOOGLE_REDIRECT_URI`).
2. Deploy. After go-live, confirm:
   - [sitemap.xml](https://vector-phi-rosy.vercel.app/sitemap.xml)
   - [robots.txt](https://vector-phi-rosy.vercel.app/robots.txt)

Private routes (`/dashboard`, `/admin`, `/faculty/…`, `/api/`) are disallowed in `robots.txt` and marked `noindex`.

---

## License

Private project. All rights reserved.
