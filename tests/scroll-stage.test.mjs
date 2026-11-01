import test from 'node:test';
import assert from 'node:assert/strict';
import { createTimeline, animate } from 'animejs';
import { stageProgress, primeStageTimeline } from '../src/lib/scroll-stage.mjs';

test('clamps before, start, middle, end, and after the stage', () => {
  for (const [scrollY, expected] of [[0, 0], [100, 0], [350, 0.5], [600, 1], [900, 1]]) {
    assert.equal(stageProgress(scrollY, 100, 500), expected);
  }
});

test('the same position has the same progress after reverse traversal', () => {
  const positions = [100, 250, 400, 600, 400, 250, 100];
  assert.deepEqual(positions.map((y) => stageProgress(y, 100, 500)), [0, 0.3, 0.6, 1, 0.6, 0.3, 0]);
});

test('uses changed geometry rather than remembered progress', () => {
  assert.equal(stageProgress(350, 100, 500), 0.5);
  assert.equal(stageProgress(350, 200, 600), 0.25);
});

test('zero and negative travel have no progress', () => {
  assert.equal(stageProgress(350, 100, 0), 0);
  assert.equal(stageProgress(350, 100, -500), 0);
});

test('non-finite inputs always yield a finite zero', () => {
  for (const invalid of [NaN, Infinity, -Infinity, undefined]) {
    assert.equal(stageProgress(invalid, 100, 500), 0);
    assert.equal(stageProgress(350, invalid, 500), 0);
    assert.equal(stageProgress(350, 100, invalid), 0);
  }
});

test('extreme finite geometry still produces finite clamped progress', () => {
  assert.equal(stageProgress(Number.MAX_VALUE, -Number.MAX_VALUE, 1), 1);
});

// Use Anime.js itself: testing only progress arithmetic misses unrendered children.
test('delayed timeline children have identical first-visit and reverse-seek states', () => {
  const card = { opacity: 1, y: 0, scale: 1 };
  const caption = { opacity: 1, y: 0 };
  const meter = { scaleX: 1 };
  let callbacks = 0;
  const timeline = createTimeline({
    autoplay: false, defaults: { ease: 'linear' }, onComplete: () => callbacks++,
  }).add(card, {
    opacity: [0, 1], y: [48, 0], scale: [0.92, 1], duration: 250,
    onComplete: () => callbacks++,
  }, 500).add(card, { y: [0, -8], scale: [1, 0.98], duration: 250 }, 750)
    .add(caption, { opacity: [0, 1], y: [16, 0], duration: 250 }, 750)
    .sync(animate(meter, { scaleX: [0, 1], duration: 1000, ease: 'linear', autoplay: false }), 0);
  const snapshot = () => [card.opacity, card.y, card.scale, caption.opacity, caption.y, meter.scaleX];
  try {
    primeStageTimeline(timeline);
    assert.equal(timeline.paused, true);
    assert.equal(timeline.currentTime, 0);
    const firstVisits = [0, 0.299, 0.4997, 0.625, 0.75, 0.875, 1].map((progress) => {
      timeline.seek(progress * timeline.duration, true);
      return [progress, snapshot()];
    });
    assert.deepEqual(firstVisits[2][1].slice(0, 5), [0, 48, 0.92, 0, 16]);
    for (const [progress, expected] of firstVisits.reverse()) {
      timeline.seek(progress * timeline.duration, true);
      assert.deepEqual(snapshot(), expected, `same state at progress ${progress}`);
    }
    assert.equal(callbacks, 0, 'priming and seeking must mute callbacks');
    assert.equal(timeline.paused, true);
  } finally {
    timeline.revert();
  }
  assert.equal(card.opacity, 1, 'revert retains the original visible static value');
  assert.equal(caption.opacity, 1);
  assert.equal(timeline.paused, true);
});

// Exercise the production tracks with the real engine, including both hold gaps.
test('all staggered cards have history-independent states through entrance, hold, and exit', async () => {
  const { addStageCards } = await import('../src/lib/scroll-stage-cards.mjs');
  const cards = Array.from({ length: 3 }, () => ({ y: 0, scale: 1, rotate: 0, opacity: 1 }));
  const timeline = createTimeline({ autoplay: false, defaults: { ease: 'linear' } });
  addStageCards(timeline, cards);
  const snapshot = () => cards.map(({ y, scale, rotate, opacity }) => [y, scale, rotate, opacity]);
  try {
    primeStageTimeline(timeline);
    const positions = [0, 150, 350, 500, 700, 800, 1000];
    const forward = positions.map((time) => {
      timeline.seek(time, true);
      return snapshot();
    });
    for (let index = positions.length - 1; index >= 0; index--) {
      timeline.seek(positions[index], true);
      assert.deepEqual(snapshot(), forward[index], `same staggered states at ${positions[index]}`);
    }
    timeline.seek(900, true);
    timeline.seek(700, true);
    assert.deepEqual(snapshot(), forward[4], 'direct 900 → 700 seek restores hold states');
    assert.deepEqual(snapshot().slice(0, 2).map((card) => card.slice(0, 2)), [[0, 1], [0, 1]]);
  } finally {
    timeline.revert();
  }
  // DOM transform cleanup is covered by the browser mode-switch regression;
  // Anime.js object-target keyframes do not share DOM inline-style restoration.
  assert.deepEqual(cards.map((card) => card.opacity), [1, 1, 1], 'static opacity restored');
});
