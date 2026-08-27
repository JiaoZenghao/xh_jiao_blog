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

test('adventure selectors disable motion for reduced-motion users', () => {
  assert.match(
    source,
    /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\.adventure__select \{[\s\S]*?transition: none;[\s\S]*?transform: none;/
  );
  assert.match(
    source,
    /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\.adventure__select:hover,\s*\n\s*\.adventure__select:active\s*\{[\s\S]*?transform: none;/
  );
});

test('rail links meet the minimum touch target size', () => {
  assert.match(
    source,
    /\.rail a \{[\s\S]*?display: block;[\s\S]*?min-height: 44px;[\s\S]*?box-sizing: border-box;/
  );
});

test('all adventure details have a semantic no-JavaScript fallback hidden after enhancement', () => {
  assert.match(
    source,
    /<div class="adventures__fallback" data-adventure-fallback>[\s\S]*?\{adventures\.map\(\(adventure\) => \([\s\S]*?<article[\s\S]*?<h3>\{adventure\.title\}<\/h3>[\s\S]*?\{adventure\.place\}[\s\S]*?\{adventure\.highlight\}[\s\S]*?\{adventure\.lesson\}[\s\S]*?<\/article>/
  );
  assert.match(
    source,
    /:global\(\.js\) \.adventures__fallback \{\s*display: none;\s*\}/
  );
  assert.match(
    source,
    /\.adventures__selectors,\s*\n\s*\.adventures__featured \{\s*display: none;\s*\}/
  );
  assert.match(source, /:global\(\.js\) \.adventures__selectors \{\s*display: grid;/);
  assert.match(source, /:global\(\.js\) \.adventures__featured \{\s*display: block;/);
});

test('top navigation and CTAs keep 44px targets on desktop and mobile', () => {
  assert.match(
    source,
    /\.topbar a,\s*\n\s*\.cta \{[\s\S]*?display: inline-flex;[\s\S]*?min-width: 44px;[\s\S]*?min-height: 44px;[\s\S]*?box-sizing: border-box;/
  );
  assert.match(
    source,
    /@media \(max-width: 840px\) \{[\s\S]*?\.topbar a \{[\s\S]*?min-width: 44px;[\s\S]*?min-height: 44px;/
  );
});

test('reduced motion overrides hover transforms at matching specificity', () => {
  assert.match(
    source,
    /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\.topbar a:hover,\s*\n\s*\.cta:hover,[\s\S]*?transform: none;/
  );
});

test('section navigation derives active ARIA state from normalized observer records', () => {
  assert.match(
    source,
    /latest\.set\(entry\.target\.id, \{[\s\S]*?isIntersecting: entry\.isIntersecting,[\s\S]*?intersectionRatio: entry\.intersectionRatio,[\s\S]*?chooseActiveSection\(\[\.\.\.latest\.values\(\)\]\)/
  );
  assert.match(source, /link\.setAttribute\('aria-current', 'location'\)/);
  assert.match(source, /link\.removeAttribute\('aria-current'\)/);
});

test('DOM handlers consume the tested disclosure and adventure state outputs', () => {
  assert.match(
    source,
    /const state = getDisclosureState\(expanded\);[\s\S]*?toggle\.setAttribute\('aria-expanded', String\(state\.expanded\)\);[\s\S]*?panel\.hidden = state\.hidden;[\s\S]*?classList\.toggle\('is-open', state\.expanded\)/
  );
  assert.match(
    source,
    /const selection = getAdventureSelection\(adventures, selectedIndex\);[\s\S]*?fields\.title\.textContent = selection\.featured\.title;[\s\S]*?fields\.lesson\.textContent = selection\.featured\.lesson;[\s\S]*?candidate\.setAttribute\('aria-pressed', String\(selected\)\)/
  );
});

test('enhancement cleanup cancels animation and removes page-scoped listeners', () => {
  assert.match(source, /cancelAnimationFrame\(animationFrame\)/);
  assert.match(source, /removeEventListener\('resize', resize\)/);
  assert.match(source, /removeEventListener\('scroll', updateScrollProgress\)/);
  assert.match(source, /removeEventListener\('pointermove', onPointerMove\)/);
  assert.match(source, /removeEventListener\('change', onMotionPreferenceChange\)/);
  assert.match(
    source,
    /const cleanupPage = \(\) => \{[\s\S]*?cleanups\.splice\(0\)\.forEach\(\(cleanup\) => cleanup\(\)\)[\s\S]*?astro:before-swap/
  );
});

test('motion preference switching and WebGL failure remain isolated from DOM setup', () => {
  assert.match(
    source,
    /const onMotionPreferenceChange = \(\) => \{[\s\S]*?if \(reduceMotion\.matches\) \{[\s\S]*?stopAnimation\(\);[\s\S]*?renderScene\(0, false\);[\s\S]*?startAnimation\(\)/
  );
  const domSetup = source.indexOf('setupScrollState();');
  const webglBoundary = source.indexOf('try {\n    setupWebGL();');
  assert.ok(domSetup >= 0 && webglBoundary > domSetup);
  assert.match(
    source,
    /catch \(error\) \{[\s\S]*?classList\.add\('webgl-unavailable'\)[\s\S]*?continuing with DOM enhancements/
  );
});
