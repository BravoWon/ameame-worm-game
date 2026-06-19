const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs'); const path = require('path');
const html = fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');

test('no lose-state tokens exist (no-fail invariant)', () => {
  for (const bad of ['gameOver','game_over','lose(','death','youDied'])
    assert.ok(!html.includes(bad), 'found forbidden token: ' + bad);
});
test('pixelRatio is capped for tablet perf', () => {
  assert.ok(/setPixelRatio\(Math\.min\(/.test(html), 'pixelRatio not capped');
});
test('all 11 module anchors present and closed', () => {
  for (const m of ['self','tiers','state','worm','input','grazables','bloom','world','audio','ui','loop']){
    assert.ok(html.includes('MODULE: '+m), 'missing module '+m);
    assert.ok(html.includes('END '+m), 'unclosed module '+m);
  }
});
test('marker copy for live-site check present', () => {
  assert.ok(html.includes('The Endless Bloom'));
  assert.ok(html.includes('Ameame'));
});
test('.nojekyll exists', () => {
  assert.ok(fs.existsSync(path.join(__dirname,'..','.nojekyll')));
});
