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
