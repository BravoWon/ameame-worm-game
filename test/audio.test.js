const { test } = require('node:test');
const assert = require('node:assert');
const { loadGame } = require('./harness');

test('layersFor grows with tier, capped at 3', () => {
  const A = loadGame().audio;
  assert.equal(A.layersFor(0), 1);
  assert.equal(A.layersFor(2), 3);
  assert.equal(A.layersFor(9), 3);
});

test('mute toggles and sfx never throws', () => {
  const A = loadGame().audio;
  A.setMuted(true); assert.equal(A.isMuted(), true);
  A.sfx('graze'); A.sfx('bloom'); // guarded; no throw
  A.setMuted(false); assert.equal(A.isMuted(), false);
});
