const { test } = require('node:test');
const assert = require('node:assert');
const { loadGame } = require('./harness');

test('game script loads under stubs without throwing and exposes Bloom', () => {
  const Bloom = loadGame();
  assert.ok(Bloom && typeof Bloom === 'object', 'window.Bloom should be an object');
  assert.equal(typeof Bloom.VERSION, 'string');
});
