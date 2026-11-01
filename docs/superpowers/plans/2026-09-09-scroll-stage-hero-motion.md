# Shared Hero Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reuse Hero's MotionScene visual in the curiosity stage, driven by the stage's scroll progress.

**Architecture:** Add an opt-in scroll mode to the shared MotionScene component. Keep default automatic behavior and signal variant unchanged. A scoped factory produces a finite paused orbit/grid timeline for the stage, synchronized alongside existing card progress.

**Tech Stack:** Astro, installed Anime.js, node:test, browser-use acceptance.

## Global Constraints

- Follow approved docs/superpowers/specs/2026-09-09-scroll-stage-hero-motion-design.md.
- No added dependencies or copied orbit markup/CSS; no changes to signal behavior or Hero autoplay behavior.
- Preserve deterministic forward/reverse state, mode-switch cleanup, static fallbacks and narrow layout-change notification.
- Do not touch AGENTS.md/.gstack/output or push commits.

### Task 1: Shared visual and scroll driver

**Files:** Modify src/components/MotionScene.astro and src/components/ScrollStage.astro; create focused orbit animation helper under src/lib/; extend tests/scroll-stage.test.mjs or add dedicated motion tests.

**Interfaces:** MotionScene accepts optional `driver: 'auto' | 'scroll'` default auto. Root exposes a data attribute for driver. Export a factory accepting scoped targets and returning a finite paused timeline; ScrollStage owns its seek/revert lifecycle. Test the real engine with plain-object targets.

- [ ] Write and run failing regression tests for first/forward/reverse orbit/grid/cell states across seven positions, muted callbacks, pause and revert restoration. Include hold intervals and two-instance isolation.
- [ ] Add the minimal driver prop and conditionally render controls only in auto mode. Auto initializer excludes scroll roots. Keep Hero and signal markup/output defaults unchanged.
- [ ] Implement scoped finite timeline: ring rotations, staggered cell formation, grid rotation and circle/square transitions, and end arrangement. Use continuous full-property tracks, initialize delayed children before rendering, and no loops for scroll mode.
- [ ] Replace stage-arena old geometry with `<MotionScene driver="scroll" />`. Remove dead shape/orbit CSS. Scale its shared graphic to fit available stage space, including 390×844 and 700px-high viewports; do not change long-track fallback rules.
- [ ] Seek/revert the shared visual with existing stage progress and motion lifecycle. Preserve root-height layout notification. Static reduced/no-JS states remain readable.
- [ ] Run node tests, pnpm build and git diff --check.

### Task 2: Acceptance and independent review

- [ ] Adapt browser regression selectors to cover stage MotionScene rings/grid/cells rather than removed stage-shapes. Check all card/visual states ascending and descending through [0,.15,.35,.5,.7,.8,1].
- [ ] Verify Hero controls still play/pause independently; scrolling stage does not mutate Hero transforms. Verify signal remains functional.
- [ ] Re-run tests/scroll-stage-layout.browser.py for mode toggles; add scroll visual cleanup checks.
- [ ] Check dark/light desktop and mobile screenshots, reduced/no-JS and short-height static fallbacks, no overflow, intact anchors.
- [ ] Independent scoped code review; fix material issues and rerun affected checks before marking complete.
