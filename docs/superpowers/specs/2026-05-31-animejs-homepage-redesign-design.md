# Anime.js-Inspired Homepage Redesign

## Goal

Redesign the single-page Astro homepage to feel like an Anime.js-style animation landing page while keeping the site recognizably personal. The result should read as a playful "TT Motion Lab": technical, dark, kinetic, and colorful, but still centered on an 11-year-old personal vlog.

## Direction

Use the Anime.js homepage as visual inspiration, not as a literal copy. Preserve the major cues:

- Dark technical background.
- Large compressed hero typography.
- Colorful geometric motion.
- Code-card and docs-style UI motifs.
- Sections that feel like an animation library feature grid.

Adapt the copy and content so it remains a personal homepage about trips, school wins, hobbies, experiments, and small adventures.

## Page Structure

The site remains a single Astro page:

- `src/pages/index.astro` imports `Layout` and `Welcome`.
- `src/layouts/Layout.astro` provides the document shell.
- `src/components/Welcome.astro` contains the homepage content, animation markup, inline script, and colocated CSS.

The homepage should include these sections:

1. Header/navigation with a compact `tt.motion` identity and links to page anchors.
2. Hero section with the main headline, personal tag, short description, fake command/code card, and animated geometric scene.
3. Toolbox-style section mapping personal content to animation concepts:
   - Timeline: daily notes, trips, school highlights.
   - Stagger: sports, games, building, and hobbies.
   - SVG Motion: experiments, facts, and creative ideas.
4. Personal intro section that keeps the vlog context clear.
5. Final start/explore section with code-like snippets and calls to explore the page.

## Animation Design

Remove the current Three.js/WebGL hero animation. Replace it with lightweight DOM/SVG/CSS animation that evokes Anime.js:

- Rotating rings or dashed orbital paths.
- Floating colorful geometric shapes.
- Staggered dots or bars.
- Animated SVG path drawing.
- Subtle pointer-driven parallax for the hero scene.
- Scroll-safe CSS animations that do not require a large runtime dependency.

No new npm dependency is required for this redesign. If JavaScript is used, keep it inline and small in `Welcome.astro`.

## Visual Style

- Background: near-black with subtle radial glow and grid/technical accents.
- Typography: bold, tight hero headline with system fallbacks or remote font imports if already acceptable in the component style.
- Accent colors: Anime.js-like bright green, pink/red, cyan, yellow, and cream text.
- Cards: dark panels with thin borders, code labels, and small technical metadata.
- Responsive layout: desktop should feel expansive and graphic; mobile should stack cleanly and keep animations contained.

## Content Voice

The site should not become a generic animation-library page. It should use technical metaphors to describe personal content:

- "All-in-one vlog motion lab."
- "Timeline" for memories and updates.
- "Stagger" for hobbies and weekend interests.
- "SVG Motion" for experiments and creative projects.

Keep language concise, playful, and age-appropriate.

## Accessibility And Robustness

- Use semantic sections, headings, and nav labels.
- Mark decorative animation elements with `aria-hidden="true"`.
- Respect reduced-motion preferences by disabling or greatly reducing continuous animation under `prefers-reduced-motion: reduce`.
- Avoid root-relative asset URLs because the site deploys under `/xh_jiao_blog`.
- Do not manually edit `dist/`.

## Testing

Run `pnpm build` after implementation. If possible, run a local dev server and inspect the page on desktop and mobile widths.

## Out Of Scope

- Adding blog post infrastructure or content collections.
- Adding Anime.js as a dependency unless later explicitly requested.
- Reworking deployment or GitHub Actions.
- Editing generated `dist/` output manually.
