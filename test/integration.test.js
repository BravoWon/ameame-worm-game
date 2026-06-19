const { test } = require('node:test');
const assert = require('node:assert');
const { loadGame } = require('./harness');

test('full headless run: grazing fills wonder, Bloom fires, tier advances, no throw', () => {
  const Bloom = loadGame();
  Bloom.startGame();
  assert.equal(Bloom.live.phase, 'playing');
  let bloomed = false, startTier = Bloom.live.tierIndex;
  for (let i=0;i<4000;i++){
    Bloom.tick(0);
    // force-fill wonder deterministically (the headless worm doesn't steer toward motes)
    if (Bloom.live.phase==='playing'){ Bloom.state.graze(Bloom.live, 0.02); }
    if (Bloom.live.phase==='blooming') bloomed = true;
  }
  assert.ok(bloomed, 'a Bloom occurred during the run');
  assert.notEqual(Bloom.live.tierIndex, startTier, 'tier advanced at least once');
});

test('startGame hides the title and seeds grazables for tier 0', () => {
  const Bloom = loadGame(); Bloom.startGame();
  assert.equal(Bloom._win.document.getElementById('overlay').style.display, 'none');
  const fams = new Set(Bloom.tiers.get(0).grazableFamilies.map(f=>f.name));
  for (const g of Bloom.grazables.list()) assert.ok(fams.has(g.family));
});
