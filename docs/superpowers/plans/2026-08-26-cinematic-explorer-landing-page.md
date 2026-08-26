# Cinematic Explorer Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the existing TT Vlog home page into a cinematic, scroll-responsive experience with accessible hobby disclosures, live section navigation, and a complete interactive Adventures section.

**Architecture:** Keep the Astro-rendered page as the complete no-JavaScript baseline. Put deterministic interaction calculations in a small dependency-free ES module that can be tested with Node's built-in test runner, while `Welcome.astro` owns semantic markup, colocated styles, DOM event wiring, and the existing Three.js scene. Progressive enhancement adds classes and ARIA state only after initialization.

**Tech Stack:** Astro 5, JavaScript ES modules with JSDoc types, Node `node:test`, CSS, Three.js 0.184.0

## Global Constraints

- Preserve the existing acid-green, near-black, cool-white, and red-glow visual system and youthful vlog voice.
- Keep `astro.config.mjs` base-path behavior intact; do not introduce root-relative asset URLs.
- Add no dependencies and do not modify `pnpm-lock.yaml`.
- Keep all content readable and navigable without JavaScript.
- Disable nonessential motion and continuous animation when `prefers-reduced-motion: reduce` is active.
- Keep touch targets at least 44 by 44 CSS pixels where practical, with visible keyboard focus.
- Use transform and opacity for UI motion; avoid layout-property animation.
- Keep component CSS colocated in `Welcome.astro` and avoid unrelated refactoring.

---

## File Map

- Create `src/scripts/vlog-interactions.mjs`: pure calculations for active-section selection, normalized scroll progress, and fine-pointer card tilt.
- Create `tests/vlog-interactions.test.mjs`: Node unit tests for the pure interaction module.
- Create `tests/welcome-contract.test.mjs`: source-level accessibility and content contract tests for the Astro component.
- Modify `src/components/Welcome.astro`: adventure and hobby data, semantic markup, CSS, DOM enhancement wiring, and Three.js scroll/reduced-motion integration.
- Modify `package.json`: add a dependency-free `test` script using Node's built-in runner.

### Task 1: Testable Interaction Calculations

**Files:**
- Create: `src/scripts/vlog-interactions.mjs`
- Create: `tests/vlog-interactions.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `clamp(value: number, min: number, max: number): number`
- Produces: `getScrollProgress(scrollY: number, scrollHeight: number, viewportHeight: number): number`
- Produces: `chooseActiveSection(entries: Array<{id: string, isIntersecting: boolean, intersectionRatio: number}>): string | null`
- Produces: `getCardTilt(pointerX: number, pointerY: number, rect: {left: number, top: number, width: number, height: number}, maxDegrees?: number): {rotateX: number, rotateY: number}`

- [ ] **Step 1: Add the Node test command and write failing calculation tests**

Add this script to `package.json` without changing dependencies:

```json
"test": "node --test tests/*.test.mjs"
```

Create `tests/vlog-interactions.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  chooseActiveSection,
  getCardTilt,
  getScrollProgress,
} from '../src/scripts/vlog-interactions.mjs';

test('getScrollProgress clamps document progress to zero through one', () => {
  assert.equal(getScrollProgress(-20, 2000, 1000), 0);
  assert.equal(getScrollProgress(500, 2000, 1000), 0.5);
  assert.equal(getScrollProgress(1500, 2000, 1000), 1);
  assert.equal(getScrollProgress(20, 800, 800), 0);
});

test('chooseActiveSection selects the intersecting section with the greatest ratio', () => {
  const active = chooseActiveSection([
    { id: 'hero', isIntersecting: true, intersectionRatio: 0.2 },
    { id: 'introduction', isIntersecting: true, intersectionRatio: 0.65 },
    { id: 'hobby', isIntersecting: false, intersectionRatio: 0.9 },
  ]);
  assert.equal(active, 'introduction');
  assert.equal(chooseActiveSection([]), null);
});

test('getCardTilt centers at zero and clamps edge rotation', () => {
  const rect = { left: 100, top: 50, width: 200, height: 100 };
  assert.deepEqual(getCardTilt(200, 100, rect), { rotateX: 0, rotateY: 0 });
  assert.deepEqual(getCardTilt(300, 50, rect, 6), { rotateX: 6, rotateY: 6 });
  assert.deepEqual(getCardTilt(0, 300, rect, 6), { rotateX: -6, rotateY: -6 });
});
```

- [ ] **Step 2: Run the tests and verify the missing module fails**

Run: `pnpm test`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `src/scripts/vlog-interactions.mjs`.

- [ ] **Step 3: Implement the pure calculations**

Create `src/scripts/vlog-interactions.mjs`:

```js
export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const getScrollProgress = (scrollY, scrollHeight, viewportHeight) => {
  const available = scrollHeight - viewportHeight;
  return available > 0 ? clamp(scrollY / available, 0, 1) : 0;
};

export const chooseActiveSection = (entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting);
  if (visible.length === 0) return null;
  return visible.reduce((best, entry) =>
    entry.intersectionRatio > best.intersectionRatio ? entry : best
  ).id;
};

export const getCardTilt = (pointerX, pointerY, rect, maxDegrees = 5) => {
  if (rect.width <= 0 || rect.height <= 0) return { rotateX: 0, rotateY: 0 };
  const normalizedX = ((pointerX - rect.left) / rect.width) * 2 - 1;
  const normalizedY = ((pointerY - rect.top) / rect.height) * 2 - 1;
  return {
    rotateX: clamp(-normalizedY * maxDegrees, -maxDegrees, maxDegrees),
    rotateY: clamp(normalizedX * maxDegrees, -maxDegrees, maxDegrees),
  };
};
```

- [ ] **Step 4: Run the tests and verify they pass**

Run: `pnpm test`

Expected: 3 tests pass and 0 fail.

- [ ] **Step 5: Commit the calculation layer**

```bash
git add package.json src/scripts/vlog-interactions.mjs tests/vlog-interactions.test.mjs
git commit -m "test: add vlog interaction calculations"
```

### Task 2: Semantic Content and No-JavaScript Baseline

**Files:**
- Create: `tests/welcome-contract.test.mjs`
- Modify: `src/components/Welcome.astro`

**Interfaces:**
- Consumes: existing Astro frontmatter arrays and server-rendered component structure.
- Produces: section IDs `hero`, `introduction`, `hobby`, and `adventures`.
- Produces: hobby buttons `[data-hobby-toggle]` with `aria-expanded` and panels `[data-hobby-detail]`.
- Produces: adventure buttons `[data-adventure-select]` with data attributes for `title`, `place`, `highlight`, and `lesson`.
- Produces: featured fields `[data-adventure-title]`, `[data-adventure-place]`, `[data-adventure-highlight]`, and `[data-adventure-lesson]`.

- [ ] **Step 1: Write failing component-contract tests**

Create `tests/welcome-contract.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../src/components/Welcome.astro', import.meta.url), 'utf8');

test('navigation maps to four unique real sections', () => {
  for (const id of ['hero', 'introduction', 'hobby', 'adventures']) {
    assert.match(source, new RegExp(`id=["']${id}["']`));
    assert.match(source, new RegExp(`href:\\s*["']#${id}["']`));
  }
  assert.doesNotMatch(source, /label:\s*['"]QUICK FACTS['"]/);
});

test('hobbies render as accessible disclosures', () => {
  assert.match(source, /data-hobby-toggle/);
  assert.match(source, /aria-expanded=["']false["']/);
  assert.match(source, /data-hobby-detail/);
});

test('adventures provide three selectors and a live featured log', () => {
  assert.match(source, /const adventures = \[/);
  const adventureObjects = source.match(/title: '[^']+',\n\s+place:/g) ?? [];
  assert.equal(adventureObjects.length, 3);
  assert.match(source, /data-adventure-select/);
  assert.match(source, /aria-pressed=/);
  assert.match(source, /aria-live=["']polite["']/);
  assert.match(source, /data-adventure-title/);
  assert.match(source, /data-adventure-lesson/);
});
```

- [ ] **Step 2: Run the component tests and verify they fail on missing Adventures/disclosures**

Run: `pnpm test`

Expected: calculation tests pass; contract tests fail because `#adventures`, hobby disclosure controls, and adventure selectors are absent.

- [ ] **Step 3: Add structured content data and semantic markup**

In `Welcome.astro` frontmatter:

- Add `extra` to each existing hobby object.
- Add exactly three adventure objects with these fields and copy:

```js
const adventures = [
  {
    title: 'Aquarium After Dark',
    place: 'Ocean Discovery Hall',
    highlight: 'Watching jellyfish glow like tiny spaceships.',
    lesson: 'The quietest animals can still be the most amazing.',
  },
  {
    title: 'Mountain Train Mission',
    place: 'Cloudline Railway',
    highlight: 'Counting tunnels while the valley disappeared into clouds.',
    lesson: 'A slow journey gives you more time to notice things.',
  },
  {
    title: 'Beach Bike Sunrise',
    place: 'East Bay Boardwalk',
    highlight: 'Racing the sunrise and stopping for warm breakfast buns.',
    lesson: 'Starting early can turn an ordinary day into an adventure.',
  },
];
```

- Replace `sections` with navigation data whose unique `href` values are `#hero`, `#introduction`, `#hobby`, and `#adventures`.
- Change each hobby card into a heading, description, 44px-or-larger button with `data-hobby-toggle`, `aria-expanded="false"`, and an associated detail paragraph marked `data-hobby-detail`.
- Add `<section class="adventures section-band" id="adventures" data-section>` after Hobby.
- Render the three adventures as `<button type="button" data-adventure-select ...>` controls; mark the first with `aria-pressed="true"` and the others false.
- Render the first adventure into the featured panel as the no-JavaScript default. Mark the panel `aria-live="polite"` and add the four featured-field data attributes from the Interfaces block.
- Add `data-section` to all four main sections and `data-section-link` to matching rail anchors.

- [ ] **Step 4: Add responsive static styles for disclosures and Adventures**

In the component style block:

- Extend glass-panel styling to the adventure selector and featured panel.
- Use an adventure layout of `minmax(220px, .65fr) minmax(0, 1.35fr)` above 840px and one column below it.
- Style adventure buttons with `min-height: 64px`, full-width text alignment, and distinct hover, pressed, `aria-pressed="true"`, and `:focus-visible` states.
- Keep hobby detail content visible in the baseline. Hide collapsed details only under `.js .hobby__detail[hidden]` so no-JavaScript content remains readable.
- Add bottom padding on mobile large enough that the fixed rail does not cover Adventures.

- [ ] **Step 5: Run contract tests and the Astro build**

Run: `pnpm test && pnpm build`

Expected: all tests pass; Astro exits 0. A Three.js chunk-size warning is acceptable because it already exists and no new dependency is introduced.

- [ ] **Step 6: Commit the semantic baseline**

```bash
git add src/components/Welcome.astro tests/welcome-contract.test.mjs
git commit -m "feat: add accessible vlog adventures"
```

### Task 3: Progressive Interaction and Scene Response

**Files:**
- Modify: `tests/welcome-contract.test.mjs`
- Modify: `src/components/Welcome.astro`

**Interfaces:**
- Consumes: `chooseActiveSection`, `getCardTilt`, and `getScrollProgress` from `src/scripts/vlog-interactions.mjs`.
- Consumes: all `data-*` hooks defined in Task 2.
- Produces: `.is-active`, `.is-visible`, `.is-enhanced`, and CSS custom properties `--tilt-x`, `--tilt-y`, and `--section-progress`.

- [ ] **Step 1: Add failing progressive-enhancement contract tests**

Append to `tests/welcome-contract.test.mjs`:

```js
test('enhancement script wires navigation, disclosures, adventures, and reduced motion', () => {
  assert.match(source, /chooseActiveSection/);
  assert.match(source, /getScrollProgress/);
  assert.match(source, /IntersectionObserver/);
  assert.match(source, /data-adventure-select/);
  assert.match(source, /aria-expanded/);
  assert.match(source, /prefers-reduced-motion:\s*reduce/);
});
```

Run: `pnpm test`

Expected: FAIL because the pure helper imports, observers, and enhancement handlers are not yet present together.

- [ ] **Step 2: Split initialization into independent enhancement functions**

In the client script, import the Task 1 helpers and create these page-scoped functions:

Use the following structure, with local null checks so one missing element cannot stop the other features:

```js
import {
  chooseActiveSection,
  getCardTilt,
  getScrollProgress,
} from '../scripts/vlog-interactions.mjs';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(pointer: fine)');
document.documentElement.classList.add('js');

const setupSectionNavigation = () => {
  const sections = [...document.querySelectorAll('[data-section]')];
  const links = [...document.querySelectorAll('[data-section-link]')];
  if (!('IntersectionObserver' in window) || sections.length === 0) return;

  const latest = new Map();
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      latest.set(entry.target.id, {
        id: entry.target.id,
        isIntersecting: entry.isIntersecting,
        intersectionRatio: entry.intersectionRatio,
      });
    }
    const activeId = chooseActiveSection([...latest.values()]);
    if (!activeId) return;
    for (const link of links) {
      const active = link.getAttribute('href') === `#${activeId}`;
      link.closest('li')?.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }, { rootMargin: '-20% 0px -55%', threshold: [0.1, 0.25, 0.5, 0.75] });
  sections.forEach((section) => observer.observe(section));
};

const setupReveals = () => {
  const items = [...document.querySelectorAll('[data-reveal]')];
  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }
  items.forEach((item) => item.classList.add('is-enhanced'));
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.16 });
  items.forEach((item) => observer.observe(item));
};

const setupHobbies = () => {
  document.querySelectorAll('[data-hobby-toggle]').forEach((toggle) => {
    const panelId = toggle.getAttribute('aria-controls');
    const panel = panelId ? document.getElementById(panelId) : null;
    if (!(toggle instanceof HTMLButtonElement) || !panel) return;
    panel.hidden = true;
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      panel.hidden = expanded;
      toggle.closest('.hobby__card')?.classList.toggle('is-open', !expanded);
    });
  });
};

const setupAdventures = () => {
  const buttons = [...document.querySelectorAll('[data-adventure-select]')];
  const fields = {
    title: document.querySelector('[data-adventure-title]'),
    place: document.querySelector('[data-adventure-place]'),
    highlight: document.querySelector('[data-adventure-highlight]'),
    lesson: document.querySelector('[data-adventure-lesson]'),
  };
  if (Object.values(fields).some((field) => !field)) return;
  buttons.forEach((button) => button.addEventListener('click', () => {
    fields.title.textContent = button.getAttribute('data-title') ?? '';
    fields.place.textContent = button.getAttribute('data-place') ?? '';
    fields.highlight.textContent = button.getAttribute('data-highlight') ?? '';
    fields.lesson.textContent = button.getAttribute('data-lesson') ?? '';
    buttons.forEach((candidate) => {
      const selected = candidate === button;
      candidate.setAttribute('aria-pressed', String(selected));
      candidate.classList.toggle('is-selected', selected);
    });
  }));
};

const setupPointerEffects = () => {
  if (!finePointer.matches || reduceMotion.matches) return;
  document.querySelectorAll('.hobby__card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const tilt = getCardTilt(event.clientX, event.clientY, card.getBoundingClientRect());
      card.style.setProperty('--tilt-x', `${tilt.rotateX}deg`);
      card.style.setProperty('--tilt-y', `${tilt.rotateY}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });
};

setupSectionNavigation();
setupReveals();
setupHobbies();
setupAdventures();
setupPointerEffects();
```

- [ ] **Step 3: Implement DOM state behavior**

- In `setupSectionNavigation`, keep a map of the latest observer entries, pass normalized records to `chooseActiveSection`, and update both `.is-active` and `aria-current="location"` on the matching rail link.
- In `setupReveals`, add `.is-enhanced` only to `[data-reveal]` elements, then add `.is-visible` when each intersects; immediately reveal everything when reduced motion is requested or `IntersectionObserver` is unavailable.
- In `setupHobbies`, set each associated detail to `hidden` after initialization. Toggle `hidden`, `aria-expanded`, and the card `.is-open` class on activation.
- In `setupAdventures`, copy the selected button's `data-title`, `data-place`, `data-highlight`, and `data-lesson` values into the four featured fields, then synchronize `aria-pressed` and `.is-selected`.
- In `setupPointerEffects`, guard with `matchMedia('(pointer: fine)')` and reduced motion. Use `getCardTilt` to set card custom properties; reset them on `pointerleave`. Apply at most a 4px translated CTA response and reset on leave.

- [ ] **Step 4: Integrate scroll and reduced-motion state into Three.js**

- Store `scrollProgress` outside the render loop and update it from a passive scroll listener via `getScrollProgress(window.scrollY, document.documentElement.scrollHeight, window.innerHeight)`.
- In the animation loop, ease a `sceneProgress` value toward `scrollProgress`; use it for small camera Y/Z offsets, fog density, and track opacity only.
- When reduced motion is active, do not schedule continuous `requestAnimationFrame`; render one stable frame after resize.
- Wrap WebGL initialization in `try/catch`, add `.webgl-unavailable` to the page if creation fails, and allow all DOM enhancements to remain operational.
- Dispose resize, scroll, pointer, and media-query listeners on `astro:before-swap` so Astro view transitions cannot duplicate handlers later.

- [ ] **Step 5: Add motion, reveal, and focus styles**

- Add `data-reveal` transitions using only opacity and transform, and activate them only through `.is-enhanced`/`.is-visible`.
- Apply hobby tilt with `transform: perspective(800px) rotateX(var(--tilt-x)) rotateY(var(--tilt-y))` only in the fine-pointer media query.
- Add visible 2–3px `:focus-visible` outlines to top navigation, CTAs, rail links, hobby toggles, adventure selectors, and the scroll cue.
- Under `@media (prefers-reduced-motion: reduce)`, remove animation/transition from every new moving element, reset transforms, and ensure reveal content is opaque.

- [ ] **Step 6: Run automated verification**

Run: `pnpm test && pnpm build && git diff --check`

Expected: all Node tests pass, Astro exits 0, and `git diff --check` prints no errors.

- [ ] **Step 7: Commit progressive interactions**

```bash
git add src/components/Welcome.astro tests/welcome-contract.test.mjs
git commit -m "feat: animate cinematic vlog interactions"
```

### Task 4: Browser Verification and Final Polish

**Files:**
- Modify: `src/components/Welcome.astro` only if browser verification reveals a scoped visual or interaction defect.

**Interfaces:**
- Consumes: the complete page from Tasks 1–3.
- Produces: verified desktop, mobile, keyboard, and reduced-motion behavior.

- [ ] **Step 1: Start the development server**

Run: `pnpm dev --host 127.0.0.1`

Expected: Astro reports a local URL and remains running in a reusable terminal session.

- [ ] **Step 2: Verify the desktop experience in a real browser**

At a 1440 by 1000 viewport:

- Load the local page and confirm there are no console errors.
- Scroll through all four sections and confirm the rail marks exactly one current destination.
- Confirm reveals occur once without layout jumps.
- Expand every hobby by mouse and keyboard; confirm `aria-expanded` follows the visible detail.
- Select every adventure; confirm all four featured values update and selected state remains obvious.
- Confirm pointer tilt is restrained and the content stays legible.

- [ ] **Step 3: Verify mobile and reduced-motion behavior**

At a 390 by 844 viewport:

- Confirm there is no horizontal overflow.
- Confirm the bottom rail does not cover hobby or adventure controls.
- Confirm every adventure selector and hobby toggle is comfortably tappable.
- Emulate reduced motion, reload, scroll the entire page, and confirm content is immediately visible, cards do not tilt, and the Three.js scene does not animate continuously.

- [ ] **Step 4: Fix only defects observed during verification and rerun checks**

For each observed defect, first add the narrowest possible assertion to `tests/welcome-contract.test.mjs` or `tests/vlog-interactions.test.mjs`, run `pnpm test` to see it fail, make the minimal component/helper change, and rerun:

```bash
pnpm test
pnpm build
git diff --check
```

Expected: all tests pass, Astro exits 0, and the diff check is clean.

- [ ] **Step 5: Commit verified polish if files changed**

```bash
git add src/components/Welcome.astro src/scripts/vlog-interactions.mjs tests
git commit -m "fix: polish cinematic vlog experience"
```

- [ ] **Step 6: Record final evidence**

Run:

```bash
pnpm test
pnpm build
git status --short
```

Expected: all tests pass, Astro exits 0, and status is clean. Report viewport checks, reduced-motion checks, and any pre-existing Three.js bundle-size warning explicitly.
