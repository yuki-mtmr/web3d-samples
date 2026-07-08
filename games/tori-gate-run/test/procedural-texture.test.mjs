import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createNoiseField, mapToRGBA } from '../lib/procedural-texture.mjs';

test('同一シード → 同一ノイズ場(決定論)', () => {
  const a = createNoiseField(42, 32, 32);
  const b = createNoiseField(42, 32, 32);
  assert.deepEqual(a, b);
});

test('異なるシード → 異なるノイズ場', () => {
  const a = createNoiseField(1, 32, 32);
  const b = createNoiseField(2, 32, 32);
  assert.notDeepEqual(a, b);
});

test('値域は [0, 1]、サイズは w*h', () => {
  const f = createNoiseField(7, 16, 8);
  assert.equal(f.length, 16 * 8);
  for (const v of f) assert.ok(v >= 0 && v <= 1, `out of range: ${v}`);
});

test('ノイズは空間的に滑らか(隣接差が小さい)かつ一様でない', () => {
  const w = 64;
  const f = createNoiseField(3, w, w);
  let maxStep = 0;
  let min = 1;
  let max = 0;
  for (let y = 0; y < w; y += 1) {
    for (let x = 1; x < w; x += 1) {
      maxStep = Math.max(maxStep, Math.abs(f[y * w + x] - f[y * w + x - 1]));
      min = Math.min(min, f[y * w + x]);
      max = Math.max(max, f[y * w + x]);
    }
  }
  assert.ok(maxStep < 0.2, `not smooth: step ${maxStep}`);
  assert.ok(max - min > 0.3, `too flat: range ${max - min}`);
});

test('mapToRGBA: 2 色ストップの線形補間で RGBA バッファを生成', () => {
  const field = Float64Array.from([0, 1]);
  const rgba = mapToRGBA(field, [
    { at: 0, color: [0, 0, 0] },
    { at: 1, color: [255, 100, 0] },
  ]);
  assert.equal(rgba.length, 8);
  assert.deepEqual([...rgba.slice(0, 4)], [0, 0, 0, 255]);
  assert.deepEqual([...rgba.slice(4, 8)], [255, 100, 0, 255]);
});

test('mapToRGBA: 中間値はストップ間を補間', () => {
  const rgba = mapToRGBA(Float64Array.from([0.5]), [
    { at: 0, color: [0, 0, 0] },
    { at: 1, color: [200, 100, 50] },
  ]);
  assert.deepEqual([...rgba.slice(0, 3)], [100, 50, 25]);
});
