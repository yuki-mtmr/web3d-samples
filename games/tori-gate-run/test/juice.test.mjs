import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createParticlePool, createShake, createHitstop } from '../lib/juice.mjs';
import { createRng } from '../lib/rng.mjs';

// --- createParticlePool: three.js 非依存の純粋な状態更新 (phase4-foundation §3.3) ---

test('spawn with injected rng is deterministic', () => {
  const a = createParticlePool(16);
  const b = createParticlePool(16);
  a.spawn({ x: 0, y: 0, z: 0 }, 8, 4, createRng(42).next);
  b.spawn({ x: 0, y: 0, z: 0 }, 8, 4, createRng(42).next);
  a.step(0.016);
  b.step(0.016);
  assert.deepEqual([...a.positions], [...b.positions]);
});

test('step(dt) moves particles and decays life until none alive', () => {
  const pool = createParticlePool(8);
  pool.spawn({ x: 1, y: 2, z: 3 }, 4, 5, createRng(1).next);
  const first = pool.step(0.016);
  assert.ok(first.alive > 0);
  // 寿命 1.0 / 減衰 1.6/s → 1 秒未満で全滅する
  for (let i = 0; i < 100; i += 1) pool.step(0.016);
  assert.equal(pool.step(0.016).alive, 0);
});

test('gravity pulls particles downward over time', () => {
  const pool = createParticlePool(4);
  // 速度 0 で真上に置き、重力だけの影響を測る
  pool.spawn({ x: 0, y: 10, z: 0 }, 1, 0, () => 0.5);
  pool.step(0.5);
  pool.step(0.5);
  assert.ok(pool.positions[1] < 10, `expected y < 10, got ${pool.positions[1]}`);
});

test('pool wraps around capacity without crashing', () => {
  const pool = createParticlePool(4);
  pool.spawn({ x: 0, y: 0, z: 0 }, 10, 2, createRng(2).next);
  const { alive } = pool.step(0.016);
  assert.ok(alive <= 4);
});

test('pool does not import three.js (engine-independent)', async () => {
  // createParticlePool は positions を Float32Array として直接公開する(three 結線は adapter 側)
  const pool = createParticlePool(2);
  assert.ok(pool.positions instanceof Float32Array);
  assert.equal(typeof pool.spawn, 'function');
  assert.equal(typeof pool.step, 'function');
});

// --- 既存 API の回帰(createShake / createHitstop は現状維持) ---

test('createShake decays trauma and reports active state', () => {
  const shake = createShake();
  assert.equal(shake.active(), false);
  shake.add(0.5);
  assert.equal(shake.active(), true);
  shake.update(1); // 1.8/s 減衰 → 0.5 は 1 秒で 0
  assert.equal(shake.active(), false);
});

test('createHitstop scales dt down while active', () => {
  const hs = createHitstop();
  assert.equal(hs.scale(0.016), 0.016);
  hs.trigger(0.1);
  assert.ok(hs.scale(0.016) < 0.016);
});
