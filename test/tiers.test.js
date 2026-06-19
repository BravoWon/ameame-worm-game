const { test } = require('node:test');
const assert = require('node:assert');
const { loadGame } = require('./harness');

test('three slice tiers exist with required keys', () => {
  const Bloom = loadGame();
  const L = Bloom.tiers.LIST;
  assert.equal(L.length, 3);
  for (const t of L) {
    for (const k of ['id','name','palette','grazableFamilies','creatures','decor','musicLayer','nextTierProp'])
      assert.ok(k in t, t.id + ' missing ' + k);
    assert.ok(t.grazableFamilies.length >= 2);
  }
});

test('every grazable family maps to a known self trait (totality)', () => {
  const Bloom = loadGame();
  const TRAIT_OF = Bloom.self.TRAIT_OF;
  for (const t of Bloom.tiers.LIST)
    for (const f of t.grazableFamilies)
      assert.ok(f.name in TRAIT_OF, 'family ' + f.name + ' has no trait mapping');
});

test('next() advances and loops at the end (endless)', () => {
  const T = loadGame().tiers;
  assert.equal(T.next(0), 1);
  assert.equal(T.next(2), 0); // loop back for slice
});
