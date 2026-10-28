import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildLattice,
  fitBoxToViewport,
  localDateSeed,
  millisecondsUntilLocalMidnight,
  renderLattice
} from '../src/lib/void/lattice.js';

const posts = Array.from({ length: 6 }, (_, index) => ({ slug: `post-${index}` }));

test('daily lattice generation is deterministic', () => {
  const first = renderLattice(buildLattice(posts, { width: 900, height: 600, seed: '2026-10-27' }), 0);
  const second = renderLattice(buildLattice(posts, { width: 900, height: 600, seed: '2026-10-27' }), 0);
  assert.deepEqual(first.map((cell) => cell.d), second.map((cell) => cell.d));
});

test('every post receives a closed cell path', () => {
  const cells = renderLattice(buildLattice(posts, { width: 900, height: 600, seed: '2026-10-27' }), 1000);
  assert.equal(cells.length, posts.length);
  assert.ok(cells.every((cell) => cell.d.startsWith('M') && cell.d.endsWith('Z')));
});

test('dense worlds keep every entry finite and renderable', () => {
  const densePosts = Array.from({ length: 125 }, (_, index) => ({ slug: `dense-post-${index}` }));
  const lattice = buildLattice(densePosts, { width: 1200, height: 900, seed: '2026-10-27' });
  const cells = renderLattice(lattice, 42_000, 57, 1);
  assert.equal(cells.length, 125);
  assert.ok(cells.every((cell) => cell.d.endsWith('Z') && !cell.d.includes('NaN')));
  assert.ok(lattice.vertices.length < densePosts.length * 4);
});

test('local date helpers roll the world at midnight', () => {
  const date = new Date(2026, 9, 27, 23, 59, 30);
  assert.equal(localDateSeed(date), '2026-10-27');
  assert.ok(millisecondsUntilLocalMidnight(date) > 30_000);
  assert.ok(millisecondsUntilLocalMidnight(date) < 32_000);
});

test('edge labels remain fully inside the visible world', () => {
  for (const [centerX, centerY] of [[0, 0], [320, 0], [0, 500], [320, 500]]) {
    const box = fitBoxToViewport({
      centerX,
      centerY,
      width: 270,
      height: 168,
      viewportWidth: 320,
      viewportHeight: 500,
      inset: 14
    });
    assert.ok(box.x >= 14 && box.y >= 14);
    assert.ok(box.x + box.width <= 306);
    assert.ok(box.y + box.height <= 486);
  }
});
