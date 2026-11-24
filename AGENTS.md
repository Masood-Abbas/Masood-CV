# Coding instructions for Masood-CV

This file is the project-level context for AI coding agents and humans making small, focused changes.

## Product context

This repository is a personal portfolio for Masood Abbas. Preserve the existing tone: concise, professional, practical, and focused on full-stack web development. Avoid adding placeholder copy, fake metrics, invented work history, or unverified links.

## Source of truth

- Treat `src/data/portfolio.ts` as the source of truth for public portfolio content.
- Treat the route tree in `src/App.tsx` as authoritative. It currently exposes `/` and the not-found fallback.
- Treat `src/index.css` and Tailwind configuration as the source of truth for the visual system.
- Do not describe the legacy/admin-oriented Supabase tables as active UI features unless the route and data access are implemented.

## Implementation rules

- Use TypeScript and existing path aliases (`@/` imports).
- Reuse existing components from `src/components/ui/` before adding new primitives.
- Keep page content data-driven; do not duplicate portfolio copy inside JSX when it belongs in `src/data/portfolio.ts`.
- Preserve responsive behavior, semantic headings, keyboard access, visible focus states, and descriptive link labels.
- Keep the interactive Three.js background optional and non-blocking. Do not make core content depend on WebGL.
- Keep public browser environment variables limited to `VITE_*` values. Never expose service-role credentials.
- Avoid broad dependency changes for a small UI or content request.
- Do not edit generated files such as `src/integrations/supabase/types.ts` or lockfiles manually unless the dependency/tooling change requires it.

## Workflow

1. Read the relevant files and check `git status` before editing.
2. Make the smallest coherent change.
3. Run `npm run lint`, `npm test`, and `npm run build` when applicable.
4. Report changed files, checks run, and any known limitation.

## Common pitfalls

- The contact form calls the `submit-contact` Edge Function; it does not write directly from the browser.
- The optional transactional-email function may not exist in every environment.
- The static CV path is `/Masood_Abbas.pdf` and the file lives in `public/`.
- Database migrations contain more planned/admin-oriented tables than the current frontend consumes.
- `dist/` is build output and should not be edited by hand.
