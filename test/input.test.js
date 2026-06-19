const { test } = require('node:test');
const assert = require('node:assert');
const { loadGame } = require('./harness');
const { makeSandbox } = require('./harness');

test('arrow keys set turnInput via window events', () => {
  const Bloom = loadGame();
  Bloom.input.install();
  // window is the sandbox global; dispatch through Bloom._win for tests
  Bloom._win.dispatch('keydown', { key:'ArrowLeft' });
  assert.equal(Bloom.input.get(), 1);
  Bloom._win.dispatch('keyup', { key:'ArrowLeft' });
  assert.equal(Bloom.input.get(), 0);
  Bloom._win.dispatch('keydown', { key:'ArrowRight' });
  assert.equal(Bloom.input.get(), -1);
});
