import test from 'node:test';
import assert from 'node:assert/strict';
import * as interactions from '../src/scripts/vlog-interactions.mjs';

const {
  chooseActiveSection,
  getCardTilt,
  getPageEndSection,
  getScrollProgress,
} = interactions;

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

test('getPageEndSection selects only the final section at the document end', () => {
  assert.equal(typeof getPageEndSection, 'function');
  assert.equal(getPageEndSection(1781, 1000, 2781, 'adventures'), 'adventures');
  assert.equal(getPageEndSection(1779, 1000, 2781, 'adventures'), 'adventures');
  assert.equal(getPageEndSection(1778, 1000, 2781, 'adventures'), null);
});

test('getCardTilt centers at zero and clamps edge rotation', () => {
  const rect = { left: 100, top: 50, width: 200, height: 100 };
  assert.deepEqual(getCardTilt(200, 100, rect), { rotateX: 0, rotateY: 0 });
  assert.deepEqual(getCardTilt(300, 50, rect, 6), { rotateX: 6, rotateY: 6 });
  assert.deepEqual(getCardTilt(0, 300, rect, 6), { rotateX: -6, rotateY: -6 });
});

test('getDisclosureState keeps expanded and hidden state synchronized', () => {
  assert.equal(typeof interactions.getDisclosureState, 'function');
  assert.deepEqual(interactions.getDisclosureState(false), {
    expanded: true,
    hidden: false,
  });
  assert.deepEqual(interactions.getDisclosureState(true), {
    expanded: false,
    hidden: true,
  });
});

test('getAdventureSelection returns featured content and one pressed selector', () => {
  assert.equal(typeof interactions.getAdventureSelection, 'function');
  const adventures = [
    { title: 'A', place: 'One', highlight: 'Glow', lesson: 'Look closely' },
    { title: 'B', place: 'Two', highlight: 'Clouds', lesson: 'Take time' },
    { title: 'C', place: 'Three', highlight: 'Sunrise', lesson: 'Start early' },
  ];

  assert.deepEqual(interactions.getAdventureSelection(adventures, 1), {
    featured: adventures[1],
    pressed: [false, true, false],
  });
});
