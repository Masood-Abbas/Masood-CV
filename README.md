# Masood Abbas — Portfolio

Personal portfolio website for Masood Abbas, built as a single-page React application. It presents the hero, about, education, experience, projects, skills, social links, CV download, and a Supabase-backed contact form.

## Stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS and shadcn/ui-style components
- Framer Motion for transitions
- React Three Fiber, Drei, and Three.js for the interactive background
- Supabase Edge Functions and PostgreSQL for contact submissions
- Vitest and Testing Library for tests

## Quick start

Requirements: Node.js 18+ and npm. Bun is also supported by the repository lockfile, but the documented commands use npm.

```bash
npm install
npm run dev
```

The Vite server uses port `8080` by default. Override it with Vite options if needed.

## Environment variables

Create a local `.env` file with the public Supabase values required by the browser client:

```dotenv
VITE_SUPABASE_PROJECT_ID=your-project-id
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Never commit service-role keys or other server secrets. The Edge Function reads its server-only credentials from Supabase Function Secrets.

## Common commands

```bash
npm run dev       # Start the development server
npm run build     # Create a production build
npm run build:dev # Create a development-mode build
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
npm test          # Run the Vitest suite once
npm run test:watch
```

## Where to make changes

- Portfolio copy, links, experience, projects, skills, and contact details: `src/data/portfolio.ts`
- Page composition and contact form behavior: `src/pages/Home.tsx`
- Global design tokens and reusable CSS utilities: `src/index.css`
- Layout shell, header, and footer: `src/components/layout/`
- Reusable UI primitives: `src/components/ui/`
- Supabase browser client: `src/integrations/supabase/`
- Contact Edge Function: `supabase/functions/submit-contact/index.ts`
- Database migrations: `supabase/migrations/` and `drizzle/migrations/`
- Static assets and CV: `public/`

The current route tree contains `/` and a catch-all not-found route. Do not assume an admin route is available: the current public UI reads its display data from the local TypeScript data file.

## Contact form

The form validates name, email, and message in the browser, then invokes the `submit-contact` Supabase Edge Function. The function validates and stores the submission in `contact_submissions` and attempts to invoke the optional `send-transactional-email` function. Email delivery failure does not prevent the submission from being stored.

To work on this flow locally, deploy the matching Supabase migration and function, then verify both a successful submission and a rejected invalid request.

## Verification before a change is finished

Run the checks relevant to the change, normally:

```bash
npm run lint
npm test
npm run build
```

For visual changes, also inspect the page at mobile and desktop widths and check keyboard focus, reduced-motion behavior, external links, and the contact form loading/error states.

## Project documentation

- [AGENTS.md](AGENTS.md) — instructions for AI coding agents and contributors
- [ARCHITECTURE.md](ARCHITECTURE.md) — current system map and data flow
- [DEVELOPMENT.md](DEVELOPMENT.md) — local development and troubleshooting guide
- [CONTENT.md](CONTENT.md) — safe workflow for editing portfolio content
- [CONTRIBUTING.md](CONTRIBUTING.md) — change checklist and review expectations
