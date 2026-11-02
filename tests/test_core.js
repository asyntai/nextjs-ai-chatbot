// Offline checks for the option handling. Run: node tests/test_core.js
import assert from 'node:assert/strict';
import { resolveOptions, isSkipped, DEFAULT_SCRIPT_URL, ENV_NAME } from '../src/core.js';

let passed = 0;
function check(name, fn) {
  fn();
  passed += 1;
  console.log('ok  ' + name);
}

check('widget ID from the prop', () => {
  const s = resolveOptions({ widgetId: 'asyntai_ab12cd34' }, {});
  assert.equal(s.widgetId, 'asyntai_ab12cd34');
  assert.equal(s.scriptUrl, DEFAULT_SCRIPT_URL);
  assert.equal(s.enableInDevelopment, true);
});

check('widget ID from the environment', () => {
  const s = resolveOptions({}, { [ENV_NAME]: 'asyntai_fromenv1' });
  assert.equal(s.widgetId, 'asyntai_fromenv1');
});

check('the prop wins over the environment', () => {
  const s = resolveOptions({ widgetId: 'asyntai_prop1' }, { [ENV_NAME]: 'asyntai_env1' });
  assert.equal(s.widgetId, 'asyntai_prop1');
});

check('spaces around the ID are removed', () => {
  assert.equal(resolveOptions({ widgetId: '  asyntai_x1  ' }, {}).widgetId, 'asyntai_x1');
});

check('missing ID gives an error, not an exception', () => {
  const s = resolveOptions(undefined, undefined);
  assert.match(s.error, /no widget ID/);
});

check('malformed ID gives an error', () => {
  assert.match(resolveOptions({ widgetId: 'abc123' }, {}).error, /does not look like a widget ID/);
  assert.match(resolveOptions({ widgetId: 'asyntai_<script>' }, {}).error, /does not look like/);
  assert.match(resolveOptions({ widgetId: 'asyntai_' }, {}).error, /does not look like/);
});

check('a non-string ID is ignored', () => {
  assert.match(resolveOptions({ widgetId: 12345 }, {}).error, /no widget ID/);
});

check('custom https script URL is kept', () => {
  const s = resolveOptions({ widgetId: 'asyntai_a1', scriptUrl: 'https://cdn.example.com/w.js' }, {});
  assert.equal(s.scriptUrl, 'https://cdn.example.com/w.js');
});

check('a plain http script URL is refused, local http is allowed', () => {
  assert.match(resolveOptions({ widgetId: 'asyntai_a1', scriptUrl: 'http://evil.example/w.js' }, {}).error, /https/);
  assert.match(resolveOptions({ widgetId: 'asyntai_a1', scriptUrl: 'javascript:alert(1)' }, {}).error, /https/);
  const local = resolveOptions({ widgetId: 'asyntai_a1', scriptUrl: 'http://127.0.0.1:8000/static/js/chat-widget.js' }, {});
  assert.equal(local.error, undefined);
});

check('enableInDevelopment=false skips only in development', () => {
  const s = resolveOptions({ widgetId: 'asyntai_a1', enableInDevelopment: false }, {});
  assert.equal(isSkipped(s, 'development'), true);
  assert.equal(isSkipped(s, 'production'), false);
  const on = resolveOptions({ widgetId: 'asyntai_a1' }, {});
  assert.equal(isSkipped(on, 'development'), false);
});

console.log('\n' + passed + ' checks passed');
