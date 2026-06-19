const fs = require('fs');
const path = require('path');
const vm = require('vm');

// ---- THREE stub: a chainable Proxy so any construction/method/property never throws ----
function makeThree() {
  const handler = {
    get(_t, k) {
      if (k === Symbol.toPrimitive || k === 'valueOf') return () => 0;
      if (k === Symbol.iterator) return function* () {};
      if (k === 'then') return undefined;
      if (k === 'isObject3D' || k === 'isMesh') return true;
      if (k === 'length') return 0;
      return proxy;
    },
    apply() { return proxy; },
    construct() { return proxy; },
  };
  const proxy = new Proxy(function () {}, handler);
  // a few named helpers the game may use as values (kept harmless)
  return proxy;
}

// ---- minimal DOM ----
function makeEl() {
  const listeners = {};
  const el = {
    style: {}, textContent: '', innerHTML: '', className: '',
    classList: { _s: new Set(), add(c){this._s.add(c);}, remove(c){this._s.delete(c);}, contains(c){return this._s.has(c);} },
    offsetWidth: 800, width: 800, height: 600,
    appendChild() {}, removeChild() {}, remove() {},
    setAttribute() {}, getContext() { return makeThree(); },
    addEventListener(type, fn) { (listeners[type] = listeners[type] || []).push(fn); },
    dispatch(type, ev) { (listeners[type] || []).forEach(fn => fn(ev || {})); },
    _listeners: listeners,
  };
  return el;
}

function makeSandbox() {
  const elements = {};
  const winListeners = {};
  const store = new Map();
  const win = {
    innerWidth: 800, innerHeight: 600, devicePixelRatio: 1,
    addEventListener(t, fn) { (winListeners[t] = winListeners[t] || []).push(fn); },
    dispatch(t, ev) { (winListeners[t] || []).forEach(fn => fn(ev || {})); },
    requestAnimationFrame() { return 0; }, // do NOT auto-loop during load
    cancelAnimationFrame() {},
    localStorage: { getItem: k => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: k => store.delete(k) },
    performance: { now: () => 0 },
    AudioContext: function () { return makeThree(); },
    webkitAudioContext: function () { return makeThree(); },
    navigator: { userAgent: 'node' },
    Math, JSON, Date, console, setTimeout: () => 0, clearTimeout: () => {}, setInterval: () => 0, clearInterval: () => {},
    _winListeners: winListeners,
  };
  const doc = {
    getElementById(id) { return (elements[id] = elements[id] || makeEl()); },
    createElement() { return makeEl(); },
    body: makeEl(), documentElement: makeEl(),
    addEventListener() {}, querySelectorAll() { return []; },
    _elements: elements,
  };
  win.window = win; win.document = doc; win.THREE = makeThree();
  win.globalThis = win;
  return win;
}

function loadGame() {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  // extract the game <script> (the one WITHOUT a src=)
  const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)];
  if (!scripts.length) throw new Error('no inline game <script> found in index.html');
  const code = scripts.map(m => m[1]).join('\n');
  const sandbox = makeSandbox();
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: 'index.html#game' });
  return sandbox.window.Bloom;
}

module.exports = { loadGame, makeSandbox };
