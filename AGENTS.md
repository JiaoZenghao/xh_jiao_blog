# AGENTS.md

Guidance for agents working in this Astro project.

## Project Snapshot
- Framework: Astro (`astro@5.x`)
- Package manager: `pnpm`
- Site config: [astro.config.mjs](/Users/jiaozenghao/work/learn/tt_blog/xh_jiao_blog/astro.config.mjs)
- Main page entry: [src/pages/index.astro](/Users/jiaozenghao/work/learn/tt_blog/xh_jiao_blog/src/pages/index.astro)

## Runbook
Run all commands from the repo root:

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
pnpm astro -- --help
```

## Codebase Structure
- `src/pages/`: route pages (`index.astro` is home)
- `src/layouts/`: page shells/layout wrappers
- `src/components/`: reusable UI blocks
- `public/`: static assets served directly
- `dist/`: build output (generated)

## Editing Rules
- Prefer minimal, targeted changes.
- Keep existing visual style and content voice unless the task explicitly asks for redesign/rewrite.
- For Astro components:
  - Keep frontmatter (`---`) imports/data at top.
  - Keep markup semantic and accessible.
  - Keep CSS colocated in the component unless there is a strong reason to extract.
- Avoid changing `dist/` manually; regenerate via `pnpm build`.
- Do not modify lockfile unless dependency changes are required.

## Validation Checklist
Before finishing a task, run:

```bash
pnpm build
```

If the change affects runtime behavior or layout, also run:

```bash
pnpm dev
```

## Notes Specific to This Repo
- `astro.config.mjs` uses:
  - `site: 'https://github.com/JiaoZenghao'`
  - `base: '/xh_jiao_blog'`
- Preserve `base`-aware asset handling (do not hardcode root-relative paths that bypass Astro base handling).

## When Unsure
- Prefer Astro official patterns over custom build tooling.
- Keep dependency footprint small.
- Document non-obvious tradeoffs in PR/task summary.
