# Development guide

## Setup

```bash
npm install
npm run dev
```

The repository currently includes a local `.env`; do not copy its values into documentation or commit new secrets. The browser needs `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` for the contact form.

## Validation

Use the smallest relevant check while iterating, then run the full set before handoff:

```bash
npm run lint
npm test
npm run build
```

Vitest uses a jsdom environment and `src/test/setup.ts`. Tests are discovered under `src/**/*.{test,spec}.{ts,tsx}`.

## Supabase work

The browser invokes `submit-contact`. The function expects `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in the Supabase environment, inserts into `contact_submissions`, and may call `send-transactional-email`.

When changing the database:

1. Add a forward-only migration under `supabase/migrations/`.
2. Keep RLS and grants explicit.
3. Update generated client types when the client-facing schema changes.
4. Test anonymous contact submission and unauthorized reads.

Do not put service-role keys in `VITE_*` variables or frontend code.

## Visual checks

For UI work, check:

- narrow mobile and wide desktop layouts;
- keyboard navigation and visible focus;
- `prefers-reduced-motion` expectations;
- slow/loading and error states for the contact form;
- CV download and external social/project links;
- page behavior when WebGL is unavailable or slow.

## Troubleshooting

- If aliases fail, confirm Vite and Vitest both map `@` to `src`.
- If the contact form fails, check browser environment variables, deployed function availability, migration state, and Supabase function logs.
- If the 3D background causes issues, temporarily inspect the page with the lazy background disabled; core page content should remain usable.
- If a build fails after a dependency update, remove only the relevant install artifacts and reinstall using the lockfile-compatible package manager; do not delete user data or reset unrelated changes.
