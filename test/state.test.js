const { test } = require('node:test');
const assert = require('node:assert');
const { loadGame } = require('./harness');

test('grazing fills wonder and triggers blooming at 1', () => {
  const Bloom = loadGame(); const st = Bloom.state.create();
  st.phase='playing';
  for (let i=0;i<5;i++) Bloom.state.graze(st, 0.25);
  assert.equal(st.wonder, 1);
  assert.equal(st.phase, 'blooming');
});

test('advanceTier increments tier, resets wonder, preserves self', () => {
  const Bloom = loadGame(); const st = Bloom.state.create();
  Bloom.self.applyGraze(st.self, 'petal');
  const traits = st.self.traits.slice();
  st.tierIndex = 0; st.wonder = 1;
  Bloom.state.advanceTier(st);
  assert.equal(st.tierIndex, 1);
  assert.equal(st.wonder, 0);
  assert.equal(st.phase, 'playing');
  assert.deepEqual(st.self.traits, traits); // authorship carries upward
});

test('advanceTier loops tier 2 back to 0 (endless)', () => {
  const Bloom = loadGame(); const st = Bloom.state.create();
  st.tierIndex = 2; Bloom.state.advanceTier(st);
  assert.equal(st.tierIndex, 0);
});
