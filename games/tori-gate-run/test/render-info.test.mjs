import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRendererInfo } from '../lib/render-info.mjs';

// three.js WebGLRenderer.info と同形のモック
const makeRenderer = (calls, triangles) => ({
  info: { render: { calls, triangles } },
});

test('reads calls/triangles from a three.js-shaped renderer', () => {
  const info = createRendererInfo(makeRenderer(24, 51000));
  assert.deepEqual(info(), { calls: 24, triangles: 51000 });
});

test('reflects live values on each call (no caching)', () => {
  const renderer = makeRenderer(1, 100);
  const info = createRendererInfo(renderer);
  assert.deepEqual(info(), { calls: 1, triangles: 100 });
  renderer.info.render.calls = 9;
  renderer.info.render.triangles = 900;
  assert.deepEqual(info(), { calls: 9, triangles: 900 });
});

test('missing renderer or info shape throws early', () => {
  assert.throws(() => createRendererInfo(null), /renderer/);
  assert.throws(() => createRendererInfo({}), /info/);
});
