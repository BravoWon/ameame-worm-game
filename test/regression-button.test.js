const { test } = require('node:test');
const assert = require('node:assert');
const { loadGame } = require('./harness');

// Regression: the Begin button must be wired AT LOAD. Previously `Bloom.ui.install`
// (which attaches the start-button click handler) ran only inside `startGame()` — and
// `startGame()` was only triggered BY that click handler — a dead-button deadlock.
// The stub tests missed it because they called `startGame()` directly.
test('clicking the Begin button starts the game (no dead-button deadlock)', () => {
  const Bloom = loadGame();
  const startBtn = Bloom._win.document.getElementById('start');
  assert.ok(startBtn && typeof startBtn.dispatch === 'function', 'start button element exists');
  assert.equal(Bloom.live.phase, 'title', 'starts on the title screen');
  startBtn.dispatch('click');                 // simulate tapping "Begin, Ameame"
  assert.equal(Bloom.live.phase, 'playing', 'clicking Begin transitions to playing');
});

test('mute button is wired at load too', () => {
  const Bloom = loadGame();
  const mute = Bloom._win.document.getElementById('mute');
  const before = Bloom.audio.isMuted();
  mute.dispatch('click');
  assert.notEqual(Bloom.audio.isMuted(), before, 'clicking mute toggles audio');
});
