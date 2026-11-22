# AGENTS.md

Guidance for agents working in this Astro project.

## Project Snapshot
- Framework: Astro (`astro@7.x`)
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

## AI-Assisted Astro Development
- Use the project-configured `astro-docs` MCP server to check official Astro APIs and patterns before making framework-specific changes.
- Check `package.json` and the installed version before applying documentation examples. This project uses Astro 7; current documentation may describe newer releases. Do not upgrade Astro or adopt newer-major features without a task requiring it.
- If the MCP server is unavailable, consult https://docs.astro.build/ and verify version compatibility; report any unresolved uncertainty.
- Use `pnpm astro add <integration>` for official integrations and `pnpm add <package>` for other dependencies instead of manually editing dependency entries.
- Run `pnpm build` and relevant existing tests after code changes.
- Project connections: `.codex/config.toml` for Codex and `.mcp.json` for Claude Code. See the README for activation and verification.

## When Unsure
- Prefer Astro official patterns over custom build tooling.
- Keep dependency footprint small.
- Document non-obvious tradeoffs in PR/task summary.


<claude-mem-context>
# Memory Context

# [xh_jiao_blog] recent context, 2026-09-09 6:30am GMT+8

Legend: 🎯session 🔴bugfix 🟣feature 🔄refactor ✅change 🔵discovery ⚖️decision 🚨security_alert 🔐security_note
Format: ID TIME TYPE TITLE
Fetch details: get_observations([IDs]) | Search: mem-search skill

Stats: 48 obs (17,104t read) | 594,380t work | 97% savings

### May 13, 2026
72 11:50a 🔵 xh_jiao_blog Tech Stack: Astro 5 + Three.js via CDN
S5 User greeted with "hi" - session just started (May 13 at 11:50 AM)
S4 Tech stack review of xh_jiao_blog project (May 13 at 11:50 AM)
S8 Redesign Welcome.astro to match Remix.run website style, especially the animation section (May 13 at 11:58 AM)
### May 24, 2026
73 11:48a 🔵 Astro Blog Project Structure Identified
74 " 🔵 Welcome.astro Contains Existing Three.js 3D Globe Animation
S12 Cross-platform CLI tool architecture design (Go + cobra + GoReleaser) — plan finalized, awaiting scaffold inputs (May 24 at 11:48 AM)
S7 Redesign Welcome.astro to match Remix.run website style, especially the animation section (May 24 at 11:48 AM)
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
101 12:17p 🟣 Three.js Added to Astro Blog Project
102 " 🔵 Three.js Bundle Size Warning in Astro Build
103 12:20p 🟣 TT Vlog Welcome Page Built with Three.js WebGL Background
104 " 🔵 Playwright Not Installed in xh_jiao_blog Project
105 " 🟣 Flash-Free Theme Detection Script Added to Layout.astro
### Jun 5, 2026
141 4:04p 🔵 Security Scan Initiated via gstack CSO Skill on xh_jiao_blog
142 " 🔵 xh_jiao_blog Project Structure: Minimal Astro Static Site
143 " 🔵 Security Scan Found localStorage Usage; No Secrets or Critical Vulnerabilities in Source
144 " 🔵 CI/CD Workflow Uses Version-Tagged Actions, Not SHA-Pinned; No CODEOWNERS or .gitleaks.toml
145 " 🔵 Git History Clean: No Leaked Secrets or Credentials Found
146 " 🔵 Welcome.astro Component: Pure Static Content, No User Input or Server-Side Logic
147 4:05p 🔵 pnpm Audit Skipped: No Network Access to npmjs.org Registry
148 4:17p 🚨 pnpm Audit Found 22 Vulnerabilities in astro@5.17.2 Dependency Tree
149 4:19p 🔵 Astro v5.18.2 Available as In-Range Patch; v6.1.10 Fixes Most Transitive CVEs
150 " 🔵 Install Scripts Found in esbuild and sharp Transitive Dependencies — Expected Legitimate Behavior
151 " ✅ First Security Report Directory Created at .gstack/security-reports
152 4:20p ✅ Security Audit Report Saved to .gstack/security-reports/2026-06-05-161901.json
### Jun 13, 2026
205 6:20p ⚖️ Cross-Platform CLI Tool Architecture Design
206 6:24p ⚖️ Cross-Platform CLI Design Plan: Go + cobra + GoReleaser
S10 Design a cross-platform CLI tool (Windows/macOS/Linux) with GitHub + GitHub Actions CI/CD — tech stack and project structure (Jun 13 at 6:25 PM)
S11 Design a cross-platform CLI tool (Windows/macOS/Linux) with Go + GitHub Actions CI/CD — architecture plan created and approved (Jun 13 at 6:25 PM)
S13 Cross-platform CLI tool architecture design (Go + cobra + GoReleaser) — design phase complete, session paused awaiting scaffold inputs (Jun 13 at 6:25 PM)
**Investigated**: User requirements: single codebase compiling to Windows/macOS/Linux native binaries, GitHub VCS, GitHub Actions CI/CD, multi-subcommand tool (git/docker/kubectl style), distributed via GitHub Releases pre-built binaries.

**Learned**: Go 1.22+ with cobra + GoReleaser is the canonical stack for this use case. GoReleaser eliminates hand-written build matrices. Standard cmd/+internal/ layout enforces thin main.go and testable commands. Version/Commit/Date injected via ldflags at compile time. Release workflow only needs built-in GITHUB_TOKEN. GoReleaser requires fetch-depth: 0 to access full tag history for changelog generation.

**Completed**: Architecture plan saved to /Users/jiaozenghao/.claude/plans/windows-macos-linux-cli-generic-blanket.md. Covers: tech stack with rationale table, full project directory structure with per-file annotations, key file skeletons (main.go/root.go/version.go), ci.yml and release.yml workflow specifications, .goreleaser.yaml configuration, end-to-end release flow, 5-step verification checklist, and explicit YAGNI list (Homebrew/Scoop/Docker/viper/pkg all deferred).

**Next Steps**: Waiting on user to provide three inputs before project scaffolding begins: (1) tool name, (2) local creation path, (3) GitHub username/org for Go module path.


Access 594k tokens of past work via get_observations([IDs]) or mem-search skill.
</claude-mem-context>
