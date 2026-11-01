import test from 'node:test';
import assert from 'node:assert/strict';
import { createScrollOrbit } from '../src/lib/motion-orbit.mjs';

const targets = () => ({
  outer: { rotate: 7 }, inner: { rotate: 9 }, orbit: { rotate: 11 },
  grid: { rotate: 13 },
  cells: Array.from({ length: 121 }, () => ({ x: 0, y: 0, scale: 1, opacity: 0.65, rotate: 0, borderRadius: '2px' })),
});
const snapshot = (value) => JSON.parse(JSON.stringify(value));

test('finite paused orbit is exact on first, forward and reverse seeks, including holds and delayed cells', () => {
  const scoped = targets();
  const original = snapshot(scoped);
  let callbacks = 0;
  const timeline = createScrollOrbit(scoped, { onComplete: () => callbacks++, onUpdate: () => callbacks++ });
  try {
    assert.equal(timeline.duration, 1000);
    assert.equal(timeline.paused, true);
    assert.equal(timeline.currentTime, 0);
    assert.equal(scoped.cells[0].scale, 0.35);
    assert.equal(scoped.cells[60].scale, 0.35);
    timeline.seek(50, true);
    assert.equal(scoped.cells[0].scale, 0.35, 'outer cells hold while formation is delayed');
    assert.ok(scoped.cells[60].scale > 0.35, 'center forms first');
    const positions = [0, 150, 350, 500, 700, 800, 1000];
    const forward = positions.map((time) => { timeline.seek(time, true); return snapshot(scoped); });
    for (let i = positions.length - 1; i >= 0; i--) {
      timeline.seek(positions[i], true);
      assert.deepEqual(snapshot(scoped), forward[i], `exact state at ${positions[i]}`);
    }
    timeline.seek(900, true);
    timeline.seek(350, true);
    assert.equal(scoped.cells[0].scale, 1, 'formation hold');
    timeline.seek(700, true);
    assert.equal(scoped.cells[0].scale, 0.5, 'circle hold');
    assert.equal(callbacks, 0);
    assert.equal(timeline.paused, true);
  } finally { timeline.revert(); }
  assert.deepEqual(snapshot(scoped), original, 'revert restores every original property');
  assert.equal(timeline.paused, true);
});

test('two scoped orbit instances never share targets or playback', () => {
  const a = targets();
  const b = targets();
  const first = createScrollOrbit(a);
  const second = createScrollOrbit(b);
  try {
    const initial = snapshot(b);
    first.seek(800, true);
    assert.deepEqual(snapshot(b), initial);
    const advanced = snapshot(a);
    second.seek(350, true);
    assert.deepEqual(snapshot(a), advanced);
    second.revert();
    assert.deepEqual(snapshot(a), advanced);
  } finally { first.revert(); second.revert(); }
});
