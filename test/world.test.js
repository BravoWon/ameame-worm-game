const { test } = require('node:test');
const assert = require('node:assert');
const { loadGame } = require('./harness');

test('build seeds creatures; stepCreatures eases them toward the worm', () => {
  const Bloom = loadGame();
  Bloom.world.build(Bloom.tiers.get(1));
  const cs = Bloom.world.creatures();
  assert.ok(cs.length >= 1);
  const c = cs[0]; c.x = 100; c.z = 0;
  const before = Math.abs(c.x - 10);
  Bloom.world.stepCreatures(10, 0);
  const after = Math.abs(c.x - 10);
  assert.ok(after < before, 'creature moved toward the worm');
});

test('build is idempotent-safe (can be called repeatedly without throwing)', () => {
  const Bloom = loadGame();
  Bloom.world.build(Bloom.tiers.get(0));
  Bloom.world.build(Bloom.tiers.get(2));
  assert.ok(Bloom.world.creatures().length >= 1);
});
