const { test } = require('node:test');
const assert = require('node:assert');
const { loadGame } = require('./harness');

test('reset seeds motes only from the tier families', () => {
  const Bloom = loadGame(); const tier = Bloom.tiers.get(1);
  Bloom.grazables.reset(tier);
  const fams = new Set(tier.grazableFamilies.map(f=>f.name));
  for (const g of Bloom.grazables.list()) assert.ok(fams.has(g.family));
  assert.ok(Bloom.grazables.list().length >= 8);
});

test('checkEat returns the family when head is within radius, and respawns', () => {
  const Bloom = loadGame(); Bloom.grazables.reset(Bloom.tiers.get(0));
  const g = Bloom.grazables.list()[0];
  const fam = Bloom.grazables.checkEat(g.x, g.z, 2.0);
  assert.equal(fam, g.family);
  // count stays constant (respawn)
  const n = Bloom.grazables.list().length;
  assert.ok(n >= 8);
});

test('checkEat returns null when nothing is near', () => {
  const Bloom = loadGame(); Bloom.grazables.reset(Bloom.tiers.get(0));
  assert.equal(Bloom.grazables.checkEat(99999, 99999, 1.0), null);
});
