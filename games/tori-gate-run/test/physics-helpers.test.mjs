import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sphereIntersectsAABB, reflect, sweptSphereHitsAABB } from '../lib/physics-helpers.mjs';

const box = { min: { x: -1, y: -1, z: -1 }, max: { x: 1, y: 1, z: 1 } };

// --- 球 vs AABB(C2: ボール反射・C1: 衝突の共通基盤) ---

test('sphereIntersectsAABB: 内部・接触・非接触', () => {
  assert.equal(sphereIntersectsAABB({ x: 0, y: 0, z: 0 }, 0.5, box), true);
  assert.equal(sphereIntersectsAABB({ x: 1.4, y: 0, z: 0 }, 0.5, box), true); // 面に食い込み
  assert.equal(sphereIntersectsAABB({ x: 2, y: 0, z: 0 }, 0.5, box), false);
});

test('sphereIntersectsAABB: 角の近傍は距離で判定', () => {
  // 角 (1,1,1) から対角に 0.6 離れた点、半径 0.5 → 非接触
  const d = 0.6 / Math.sqrt(3);
  assert.equal(sphereIntersectsAABB({ x: 1 + d, y: 1 + d, z: 1 + d }, 0.5, box), false);
  assert.equal(sphereIntersectsAABB({ x: 1 + d, y: 1 + d, z: 1 + d }, 0.7, box), true);
});

// --- 反射(velocity, normal) ---

test('reflect: 法線に対する速度反転(restitution 付き)', () => {
  const v = reflect({ x: 3, y: -4, z: 0 }, { x: 0, y: 1, z: 0 });
  assert.deepEqual(v, { x: 3, y: 4, z: 0 });
  const damped = reflect({ x: 0, y: -4, z: 0 }, { x: 0, y: 1, z: 0 }, 0.5);
  assert.deepEqual(damped, { x: 0, y: 2, z: 0 });
});

test('reflect: 元の velocity を変異しない(immutability)', () => {
  const v = { x: 1, y: -1, z: 0 };
  reflect(v, { x: 0, y: 1, z: 0 });
  assert.deepEqual(v, { x: 1, y: -1, z: 0 });
});

// --- swept 判定(トンネリング検査: 高速時に 1 フレームで箱を素通りしないか) ---

test('sweptSphereHitsAABB: フレーム内で箱を貫通する移動を検出', () => {
  // 半径 0.1 の球が x=-5 → x=+5 へ 1 ステップ移動(静的判定では両端とも非接触)
  const from = { x: -5, y: 0, z: 0 };
  const to = { x: 5, y: 0, z: 0 };
  assert.equal(sphereIntersectsAABB(from, 0.1, box), false);
  assert.equal(sphereIntersectsAABB(to, 0.1, box), false);
  assert.equal(sweptSphereHitsAABB(from, to, 0.1, box), true);
});

test('sweptSphereHitsAABB: 箱に触れない経路は false', () => {
  assert.equal(
    sweptSphereHitsAABB({ x: -5, y: 3, z: 0 }, { x: 5, y: 3, z: 0 }, 0.1, box),
    false
  );
});

test('sweptSphereHitsAABB: 移動なし(from=to)は静的判定と一致', () => {
  assert.equal(sweptSphereHitsAABB({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, 0.1, box), true);
  assert.equal(sweptSphereHitsAABB({ x: 9, y: 9, z: 9 }, { x: 9, y: 9, z: 9 }, 0.1, box), false);
});
