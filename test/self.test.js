const { test } = require('node:test');
const assert = require('node:assert');
const { loadGame } = require('./harness');

test('self.create returns defaults', () => {
  const S = loadGame().self;
  const s = S.create();
  assert.equal(typeof s.hueBias, 'number');
  assert.deepEqual(s.parts, []);
  assert.deepEqual(s.traits, []);
});

test('applyGraze shifts hue and records a trait for a known family', () => {
  const S = loadGame().self;
  const s = S.create();
  const before = s.hueBias;
  S.applyGraze(s, 'petal');           // petal -> 'frill' trait, pink hue
  assert.notEqual(s.hueBias, before);
  assert.ok(s.traits.includes('frill') || s.parts.includes('frill'));
});

test('save then load round-trips', () => {
  const S = loadGame().self;
  const s = S.create(); S.applyGraze(s, 'dewdrop'); S.save(s);
  const r = S.load();
  assert.deepEqual(r.traits.sort(), s.traits.sort());
  assert.equal(Math.round(r.hueBias*1000), Math.round(s.hueBias*1000));
});

test('load returns a fresh default when storage empty', () => {
  const Bloom = loadGame();           // fresh sandbox = empty storage
  const r = Bloom.self.load();
  assert.deepEqual(r.parts, []);
});
