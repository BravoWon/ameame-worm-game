const { test } = require('node:test');
const assert = require('node:assert');
const { loadGame } = require('./harness');

test('step advances head along heading and records path', () => {
  const W = loadGame().worm; const w = W.create();
  const x0 = w.x;
  W.step(w, 0, 1);
  assert.notEqual(w.x, x0);
  assert.ok(w.path.length >= 1);
});

test('turn input curves the heading (carving inertia, not instant)', () => {
  const W = loadGame().worm; const w = W.create();
  const h0 = w.heading;
  W.step(w, 1, 1);
  const d1 = Math.abs(w.heading - h0);
  assert.ok(d1 > 0 && d1 < 1, 'heading eases, not snaps');
});

test('grow adds a segment; reset recenters but keeps segments', () => {
  const W = loadGame().worm; const w = W.create();
  const n0 = w.segments; W.grow(w); assert.equal(w.segments, n0+1);
  w.x = 50; W.reset(w); assert.equal(w.x, 0); assert.equal(w.segments, n0+1);
});
