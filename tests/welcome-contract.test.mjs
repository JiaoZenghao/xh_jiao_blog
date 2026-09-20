import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../src/components/Welcome.astro', import.meta.url), 'utf8');
const motion = await readFile(new URL('../src/components/MotionScene.astro', import.meta.url), 'utf8');

// These contracts describe the replacement of the former adventure/WebGL design.
test('navigation targets existing unique sections', () => {
  const sections = [...source.matchAll(/<section[^>]*id="([^"]+)"/g)].map(m => m[1]);
  const targets = [...source.matchAll(/href: '#([^']+)'/g)].map(m => m[1]);
  assert.equal(new Set(sections).size, sections.length);
  assert.deepEqual([...targets].sort(), [...sections].sort());
  for (const match of source.matchAll(/href="#([^"]+)"/g)) {
    assert.ok(sections.includes(match[1]));
  }
});

test('hero and profile have different scenes', () => {
  assert.ok(source.includes('<MotionScene />'));
  assert.ok(source.includes('<MotionScene variant="signal"'));
});

test('animation controls are scoped per scene', () => {
  assert.ok(motion.includes("querySelectorAll<HTMLElement>('[data-motion-scene]').forEach"));
  assert.ok(motion.includes("scene.querySelector<HTMLButtonElement>('[data-motion-pause]')"));
  assert.ok(motion.includes("scene.querySelector<HTMLButtonElement>('[data-motion-replay]')"));
  assert.ok(motion.includes("pauseButton.setAttribute('aria-pressed'"));
});

test('playback respects reduced motion, manual pause and visibility', () => {
  assert.ok(motion.includes('manuallyPaused || reducedMotion.matches'));
  assert.ok(motion.includes('!paused && inView && !document.hidden'));
  assert.ok(motion.includes("reducedMotion.addEventListener('change', syncPlayback)"));
  assert.ok(source.includes("motion.addEventListener('change', updateProgress)"));
});
