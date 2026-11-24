# Portfolio content guide

## Edit content here

Update `src/data/portfolio.ts` for:

- name, CV path, hero badge, description, and calls to action;
- about paragraphs and personal details;
- education and employment history;
- projects, features, technologies, and repository links;
- skill categories and social/contact links.

The file contains TypeScript interfaces for the expected shape. Keep those types accurate when adding fields.

## Content rules

- Use factual, first-person professional copy.
- Keep date ranges and job titles consistent with the CV in `public/Masood_Abbas.pdf`.
- Use valid `https://`, `mailto:`, `tel:`, hash, or public asset URLs as appropriate.
- Use `null` when an optional project link does not exist; do not use dead placeholder URLs.
- Preserve the existing section ordering unless the page structure is intentionally changing.
- Avoid putting secrets, private contact credentials, or server configuration in this file.

## Asset rules

- Publicly served files belong in `public/` and use root-relative paths such as `/Masood_Abbas.pdf`.
- Bundled source assets belong in `src/assets/` and should be imported by code.
- Check file names and casing because deployment environments may be case-sensitive.

## After editing

Run lint, tests, and a production build. Manually verify every changed link and inspect the rendered text at mobile width.
