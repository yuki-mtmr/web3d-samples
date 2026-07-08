import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clientToNdc } from '../lib/picking.mjs';
import { normalizePointer } from '../lib/input-bindings.mjs';

const rect = { left: 100, top: 50, width: 800, height: 600 };

test('clientToNdc: 中央は (0, 0)', () => {
  assert.deepEqual(clientToNdc(500, 350, rect), { x: 0, y: 0 });
});

test('clientToNdc: 左上は (-1, 1)、右下は (1, -1)(NDC は y 反転)', () => {
  assert.deepEqual(clientToNdc(100, 50, rect), { x: -1, y: 1 });
  assert.deepEqual(clientToNdc(900, 650, rect), { x: 1, y: -1 });
});

test('normalizePointer: 要素サイズ非依存の 0..1 正規化', () => {
  assert.deepEqual(normalizePointer(100, 50, rect), { x: 0, y: 0 });
  assert.deepEqual(normalizePointer(900, 650, rect), { x: 1, y: 1 });
  assert.deepEqual(normalizePointer(500, 350, rect), { x: 0.5, y: 0.5 });
});

test('normalizePointer: 要素外は 0..1 にクランプ', () => {
  const r = normalizePointer(2000, -100, rect);
  assert.equal(r.x, 1);
  assert.equal(r.y, 0);
});
