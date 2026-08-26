# Cinematic Explorer Landing Page Design

## Goal

Make the existing TT Vlog landing page feel more polished, animated, and interactive without replacing its established dark cinematic visual language. The result should balance scroll-driven storytelling with playful click and tap interactions, remain responsive and accessible, and introduce the missing Adventures section already referenced by the page navigation.

## Selected Direction

The selected direction is **Cinematic Explorer**. The existing Three.js particle landscape remains the visual anchor. Semantic Astro content sits above it and receives progressively enhanced motion and interaction. The experience should still be readable and navigable when JavaScript is unavailable or the user requests reduced motion.

## Content Structure

The page contains four navigable destinations:

1. Hero
2. Introduction, including Quick Facts
3. Hobby
4. Adventures

The existing rail remains the primary section-progress control. Duplicate rail labels that point to the same content will be removed so each visible item maps to one real section. The Adventures section will contain three fictional sample entries written in the same youthful vlog voice as the existing content. Adventure data will live in the Astro frontmatter so it can be replaced without editing the component markup or interaction logic.

## Interaction Design

### Hero

- Add a visible scroll cue that points toward the Introduction section.
- Add a compact animated status readout to reinforce the explorer theme.
- Give the hero calls to action subtle pointer-responsive movement on devices with a fine pointer.
- Preserve clear hover, pressed, and keyboard-focus states.

### Section Progress

- Observe the main content sections and mark the most relevant rail item as active.
- Represent the active state with more than color by combining the existing luminous marker with a text or shape change.
- Keep anchor links functional before the enhancement script runs.
- Update the Three.js camera position and scene intensity gently from normalized scroll progress.

### Introduction and Quick Facts

- Reveal the introduction copy and facts card as they enter the viewport.
- Use staggered opacity and transform transitions rather than layout-affecting animation.
- Keep the full content visible by default; the enhancement script may opt elements into reveal behavior only after initialization.

### Hobby Cards

- Treat each hobby as an accessible disclosure control.
- Clicking, tapping, or activating with the keyboard expands one extra detail.
- Fine-pointer devices receive a restrained card-tilt effect while hovering.
- Touch and keyboard users receive equivalent selected, pressed, and expanded feedback without depending on hover.

### Adventures

- Add three journey selectors and one featured travel-log panel.
- Each entry includes a title, place, short highlight, and lesson learned.
- Selecting an entry updates the featured panel without moving keyboard focus unexpectedly.
- Use semantic buttons with `aria-pressed`; announce the changed travel-log title in a polite live region.
- Render the first entry as the complete default state so the section remains useful without JavaScript.

## Visual System

Keep the current acid green, near-black, cool white, and red glow palette. New components reuse the existing mono labels, glass surfaces, thin translucent borders, scanlines, and restrained luminous shadows. Motion should feel like camera movement and signal activation rather than unrelated decoration.

Use transform and opacity for UI animation. Avoid animating width, height, or other layout-heavy properties. Typical interaction transitions should remain in the 160–300 ms range; longer entrance sequences may use up to 700 ms when they are non-blocking.

## Responsive Behavior

- Desktop and other fine-pointer devices receive card tilt, mild CTA magnetism, and richer parallax.
- Touch devices receive clear pressed and selected states with no hover-only information.
- Interactive controls have a minimum 44 by 44 CSS pixel target where practical.
- The Adventures selectors stack or become a compact grid on narrow screens; the featured panel remains in normal document flow.
- The fixed navigation rail continues to collapse into a bottom control on small screens without obscuring the final section.

## Accessibility and Reduced Motion

- Preserve semantic headings, sections, navigation, links, and buttons.
- Provide visible `:focus-visible` treatment for every interactive element.
- Expose disclosure state with `aria-expanded` and adventure selection with `aria-pressed`.
- Do not communicate current or selected state through color alone.
- When `prefers-reduced-motion: reduce` is active, disable entrance motion, tilt, magnetism, scroll parallax, and continuous decorative scene animation. Render a stable Three.js frame or otherwise leave the static visual background intact.
- If WebGL initialization fails, keep the CSS background and all page content functional.

## Implementation Boundaries

Keep the dependency footprint unchanged. Implement the feature within the existing Astro and Three.js setup. Content data stays in `Welcome.astro` frontmatter, markup stays semantic, component CSS remains colocated, and the browser enhancement code remains scoped to the page.

The implementation may extract small pure interaction helpers when doing so makes behavior testable, but it should avoid unrelated component or build-tool refactoring.

## State and Data Flow

- Astro renders hobbies, adventures, and default selected states at build time.
- A page-scoped initialization routine discovers section, hobby, adventure, and scene elements after parsing.
- Intersection observation controls reveal classes and section-navigation state.
- Pointer events write normalized input values; the existing animation loop eases toward those values.
- Adventure button activation reads its rendered data attributes, updates the featured panel, and synchronizes `aria-pressed`.
- Hobby activation toggles only its associated disclosure and `aria-expanded` state.

## Failure Handling

The page uses progressive enhancement. If observers, pointer capabilities, or WebGL are unavailable, the user still sees all content and can use anchor navigation and semantic disclosures. Enhancement-specific listeners should be registered only when their required elements and browser APIs exist. Initialization failures must not prevent the rest of the page script from setting up independent UI features.

## Verification

1. Run the project's production build with `pnpm build`.
2. Verify that each rail item points to a unique, present section.
3. Verify hobby disclosures and adventure selectors with mouse, touch-sized viewport, and keyboard.
4. Verify visible focus, `aria-expanded`, `aria-pressed`, and live-region updates.
5. Verify that reduced-motion mode removes nonessential motion and continuous animation.
6. Inspect desktop and mobile layouts in a real browser, including the bottom rail and final Adventures content.
7. Confirm that no new root-relative asset paths bypass Astro's configured base path.

## Success Criteria

- The page visibly combines scroll-driven storytelling with meaningful click and tap interactions.
- Adventures is a complete, navigable section with three replaceable sample entries.
- Navigation accurately follows the current section.
- All interactive content works with keyboard input and does not depend on hover.
- Reduced-motion users receive a stable, readable presentation.
- The production build succeeds without adding a dependency or modifying the lockfile.
