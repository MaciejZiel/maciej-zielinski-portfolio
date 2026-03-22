# Maciej Zieliński Portfolio

Single-page portfolio website built with Vite, React, and TypeScript. The site is designed for backend, Python, AI, and software engineering internship or junior-role applications.

## Stack

- Vite
- React 19
- TypeScript
- Plain CSS with a modular component structure

## Local development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Deployment

The project is prepared for static deployment on Cloudflare Pages.

- Build command: `npm run build`
- Output directory: `dist`
- Root directory: `/`

The `public/_headers` file ships basic security-related headers and cache hints for static assets.
The `public/_redirects` file keeps the single-page setup safe for direct entry on future client-side routes if the site expands.

## Project structure

```text
src/
  components/
    layout/
    sections/
    ui/
  data/
    portfolio.ts
  styles/
    app.css
    global.css
  types/
    portfolio.ts
  App.tsx
  main.tsx
public/
  _headers
  _redirects
  favicon.svg
```

## Content model

Most editable content lives in [`src/data/portfolio.ts`](./src/data/portfolio.ts).

That includes:

- hero copy
- navigation links
- featured projects
- skill groups
- contact details

## Notes

- `CaseFlow` is presented as a featured backend project with a profile link because the main implementation is private.
- The site uses semantic sections and basic accessibility support, including a skip link and keyboard-friendly link states.
