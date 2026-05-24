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


<claude-mem-context>
# Memory Context

# [xh_jiao_blog] recent context, 2026-05-24 12:18pm GMT+8

Legend: 🎯session 🔴bugfix 🟣feature 🔄refactor ✅change 🔵discovery ⚖️decision 🚨security_alert 🔐security_note
Format: ID TIME TYPE TITLE
Fetch details: get_observations([IDs]) | Search: mem-search skill

Stats: 28 obs (9,249t read) | 99,502t work | 91% savings

### May 24, 2026
73 11:48a 🔵 Astro Blog Project Structure Identified
74 " 🔵 Welcome.astro Contains Existing Three.js 3D Globe Animation
S7 Redesign Welcome.astro to match Remix.run website style, especially the animation section (May 24 at 11:48 AM)
S8 Redesign Welcome.astro to match Remix.run website style, especially the animation section (May 24 at 11:48 AM)
75 11:49a 🔵 Welcome.astro Full CSS Architecture Documented
76 11:56a 🔵 Three.js loaded via CDN, not installed locally in xh_jiao_blog
77 11:57a 🔵 npm registry unreachable and pnpm store mismatch block local Three.js install
78 " ✅ Three.js installed locally as npm dependency (v0.184.0)
79 11:59a 🟣 Welcome.astro fully rewritten to Remix.run-inspired dark cinematic design
80 12:00p ✅ Layout.astro title updated and theme detection script confirmed present despite dark-only redesign
81 " 🟣 Remix-style redesign builds successfully; Three.js bundle is 516 kB (130 kB gzip)
82 " 🔵 Playwright screenshot via npx inline node script fails with zsh "bad substitution" due to backtick quoting
83 " 🔵 Playwright visual verification blocked: zsh bad substitution persists and ps command not permitted in sandbox
84 12:02p 🔵 Playwright script quoting fixed by switching outer quotes to single-quotes; script now running but no output after 30s
85 " 🔵 Playwright browser launch appears to hang indefinitely — likely blocked by sandbox network or missing Chromium binary
86 12:05p 🔵 npx playwright definitively fails with ENOTFOUND — npm registry unreachable, playwright cannot be installed for visual verification
87 12:06p 🔵 Three stuck playwright/npx processes confirmed running: PIDs 9481, 57114, 63337
88 12:07p 🔵 npx -p playwright node -e cannot require('playwright') — package not in local node_modules or npx PATH context
89 12:08p 🔵 playwright_cli.sh wrapper uses @playwright/mcp package (not playwright) — also network-blocked; all playwright verification impossible in sandbox
90 " ✅ playwright@1.60.0 installed locally as dev dependency from pnpm cache
91 " 🔵 Chrome browser launches via playwright but crashes immediately with EPERM kill — sandbox blocks Chrome process management
92 12:09p 🔵 Chrome launched successfully with escalated permissions but page.goto timed out at 30s waiting for networkidle
93 " 🟣 Playwright visual verification succeeded — Remix redesign confirmed rendering correctly on desktop and mobile
94 12:11p ✅ Welcome.astro visual tuning — larger hero text, wider layout, denser particle spread
96 " 🔵 Playwright screenshot capture timed out — dev server likely not running on port 4322
97 " 🔵 Playwright visual verification confirmed Welcome.astro renders correctly on desktop and mobile
98 " 🔵 Playwright/Chrome processes left running after screenshot capture
95 " 🔵 Astro blog build succeeds with large JS chunk warning from Welcome.astro particle script
99 12:14p 🔴 Orphaned Playwright/Chrome processes manually killed after screenshot session
100 12:16p ✅ Removed Playwright Dev Dependency from xh_jiao_blog

Access 100k tokens of past work via get_observations([IDs]) or mem-search skill.
</claude-mem-context>