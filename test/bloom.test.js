const { test } = require('node:test');
const assert = require('node:assert');
const { loadGame } = require('./harness');

test('bloom timeline advances and completes a tier transition', () => {
  const Bloom = loadGame();
  const st = Bloom.state.create(); st.phase='blooming'; st.tierIndex=0; st.wonder=1;
  const w = Bloom.worm.create(); w.x = 40;
  Bloom.self.applyGraze(st.self, 'petal'); const traits = st.self.traits.slice();
  Bloom.bloom.begin(st);
  let guard=0; while (st.phase==='blooming' && guard++ < 1000) Bloom.bloom.update(st, w);
  assert.equal(st.tierIndex, 1, 'advanced one tier');
  assert.equal(st.phase, 'playing');
  assert.equal(w.x, 0, 'worm recentered small in new world');
  assert.deepEqual(st.self.traits, traits, 'authorship preserved');
  assert.ok(guard < 1000, 'timeline terminates');
});
