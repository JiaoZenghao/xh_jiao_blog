# CLAUDE.md


## Commands

```bash
pnpm dev        # Start dev server at localhost:4321
pnpm build      # Build to ./dist/ (run before finishing any task)
pnpm preview    # Preview production build locally
pnpm install    # Install dependencies
```

Always run `pnpm build` before finishing a task to confirm there are no build errors.

## Architecture

Single-page personal blog/vlog built with **Astro 5.x** and deployed to GitHub Pages.

- `src/pages/index.astro` — sole page; imports the Welcome component
- `src/layouts/Layout.astro` — base HTML shell used by all pages
- `src/components/Welcome.astro` — the entire site UI: hero 3D scene, intro, and hobbies sections
- `public/` — static assets served directly

No content collections, no markdown posts, no additional Astro integrations — the site is intentionally minimal (only `astro` as a runtime dependency).

## Key Constraints

**Base path**: The site is deployed at `/xh_jiao_blog` (set in `astro.config.mjs`). Always use `import.meta.env.BASE_URL` for asset references — never hardcode root-relative paths.

**CSS**: Keep styles colocated in `<style>` blocks inside each `.astro` component. Do not extract to separate CSS files unless strongly justified.

**Scripts**: The Three.js hero scene uses `<script type="module" is:inline>` with Three.js loaded from unpkg CDN. Keep the dependency footprint small — avoid adding npm packages unless necessary.

**Astro frontmatter**: Keep `---` frontmatter (imports, data) at the top of every component.


## Deployment

GitHub Actions (`.github/workflows/astro.yml`) auto-deploys `main` to GitHub Pages using `withastro/action@v5`. Do not modify `dist/` manually.
