# Scroll-linked Stage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a three-phase, bidirectional scroll-driven sticky stage between hero and introduction.

**Architecture:** A self-contained ScrollStage Astro component owns markup, sticky CSS and a paused Anime.js timeline. A dependency-free progress helper maps document scroll to deterministic animation progress. Welcome only imports and renders the component.

**Tech Stack:** Astro 5, Anime.js 4, native requestAnimationFrame, node:test.

## Global Constraints

- Follow docs/superpowers/specs/2026-09-09-scroll-linked-stage-design.md, approved by the user.
- No new npm dependencies; no wheel interception; preserve content, navigation, themes and base-aware assets.
- Keep local AGENTS.md, .gstack and output changes untouched.
- Isolate stage animation targets from existing section-copy / hobby__card effects.
- Reduced motion and no JavaScript retain readable static content without a long empty scroll track.

### Task 1: Stage component and deterministic progress

**Files:** Create src/components/ScrollStage.astro, src/lib/scroll-stage.mjs, tests/scroll-stage.test.mjs; modify src/components/Welcome.astro.

**Interfaces:** Export `stageProgress(scrollY, top, travel)` returning a finite clamped number 0–1. Timeline seeks from this value, not elapsed time.

- [ ] Write node:test cases for before/start/middle/end/after, same position after reverse traversal, changed geometry, and zero/negative travel. Invoke `node --test tests/scroll-stage.test.mjs`; verify missing export/module failure before implementation.
- [ ] Implement the progress function with finite input protection, `travel <= 0 ? 0 : Math.min(1, Math.max(0, (scrollY - top) / travel))`; re-run tests.
- [ ] Build semantic stage content: eyebrow, heading, decorative orbit/shapes, three Move/Build/Learn cards, closing caption, progress meter and scroll hint. Use static readable default layout. Decorative shapes are aria-hidden; do not announce changing phases live.
- [ ] Add enhanced-only sticky styles: about 260svh desktop / 220svh mobile, viewport-sized inner panel, safe card sizes and scoped colors for dark/light. Reduced motion resets to static layout and visible content.
- [ ] Implement scoped paused timeline with linear progression: gathering through 30%, staggered cards through 75%, organized finish through 100%. Reuse animejs createTimeline and animate APIs from installed types. Do not animate elements owned by Welcome's existing code.
- [ ] Drive `.seek(stageProgress(...) * timeline.duration)` from passive scroll + one queued RAF. Cache top and travel on resize/load, use ResizeObserver for layout changes, update on reduced-motion changes. Avoid ongoing animation loops in the stage. Initially enhance only after timeline initialization succeeds.
- [ ] Import ScrollStage and place `<ScrollStage />` between hero and introduction. Run unit tests and pnpm build; inspect diff for unrelated changes.

### Task 2: Browser acceptance and review

**Files:** No production files unless acceptance exposes a defect; save screenshots only under ignored local scratch.

- [ ] Start or reuse pnpm dev. Inspect initial, middle, end and reverse-to-middle stage states in a real browser and confirm transform equality at the same scroll position.
- [ ] Check 390px mobile width, no horizontal overflow, light theme readability, navigation to #introduction, reduced-motion static layout, and no-JavaScript content.
- [ ] Run `node --test tests/scroll-stage.test.mjs`, `pnpm build`, `git diff --check` after fixes.
- [ ] Review all changed/new production files against the approved design for spec compliance and code quality. Fix material findings and reverify before completion.
