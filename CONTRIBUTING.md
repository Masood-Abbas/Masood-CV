# Contributing

Keep changes focused and easy to review. A content edit, UI improvement, and backend migration should normally be separate changes unless they are inseparable.

## Change checklist

- Read `AGENTS.md` and the relevant documentation before editing.
- Check `git status` and preserve unrelated work.
- Reuse existing patterns and components.
- Keep copy in `src/data/portfolio.ts` when it is portfolio content.
- Add or update tests for changed behavior where practical.
- Run `npm run lint`, `npm test`, and `npm run build` before handoff.
- For UI changes, verify responsive layout and accessibility basics.
- Do not commit `.env` secrets, service-role keys, build output, or debug logs.

## Commit guidance

Use a short imperative subject that describes the result, for example:

```text
Update portfolio project links
Improve contact form error state
Document Supabase contact flow
```

## Pull request notes

Include the purpose of the change, files or areas affected, validation commands, and any environment or Supabase setup required. Include screenshots for meaningful visual changes.
