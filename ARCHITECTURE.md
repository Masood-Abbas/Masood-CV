# Architecture

## Runtime shape

```text
Browser
  └─ Vite React app
      ├─ App.tsx (providers + routes)
      ├─ Home.tsx (single-page sections + contact form)
      ├─ portfolio.ts (static display data)
      ├─ layout components (header, footer, navigation)
      ├─ shadcn/ui-style primitives
      └─ lazy Three.js background

Contact form
  └─ Supabase browser client
      └─ submit-contact Edge Function
          ├─ validates and inserts contact_submissions
          └─ optionally invokes send-transactional-email
```

## Application entry points

- `src/main.tsx` mounts the React application.
- `src/App.tsx` creates the React Query and UI providers and defines routes.
- `src/pages/Home.tsx` owns the current public page composition.
- `src/pages/NotFound.tsx` handles all unknown paths.

## Data ownership

The public page imports `site`, hero content, about content, education, experience, projects, skills, social links, and contact information from `src/data/portfolio.ts`. This is local, compile-time data. Updating the database alone will not change the public page today.

Supabase is currently used by the contact submission flow. `src/integrations/supabase/types.ts` supplies generated TypeScript types for the client.

The SQL under `supabase/migrations/` includes contact storage, role/RLS helpers, media policies, and a broader portfolio schema. The broader schema is not currently connected to a visible admin route in `src/App.tsx`.

## Styling and interaction

- Tailwind utility classes provide most component styling.
- CSS variables and reusable classes live in `src/index.css`.
- Motion effects use Framer Motion.
- `Interactive3DBackground` is lazy-loaded and rendered behind content with `pointer-events-none`.

When changing layout, preserve the section IDs used by the header navigation: `home`, `about`, `experience`, `projects`, `skills`, and `contact`.
