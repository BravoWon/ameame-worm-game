const { test } = require('node:test');
const assert = require('node:assert');
const { loadGame } = require('./harness');

test('setWonder writes the meter width; hideTitle hides overlay', () => {
  const Bloom = loadGame(); Bloom.ui.install();
  Bloom.ui.setWonder(0.5);
  const meter = Bloom._win.document.getElementById('meterFill');
  assert.equal(meter.style.width, '50%');
  Bloom.ui.hideTitle();
  assert.equal(Bloom._win.document.getElementById('overlay').style.display, 'none');
});
