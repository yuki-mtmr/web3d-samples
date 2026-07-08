import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createLoop } from '../lib/loop.mjs';

test('fixed step: 経過時間ぶんだけ update が固定幅で呼ばれる', () => {
  const calls = [];
  const loop = createLoop({
    fixedStep: 1 / 60,
    update: (dt) => calls.push(dt),
  });
  loop.tick(3 / 60);
  assert.equal(calls.length, 3);
  for (const dt of calls) assert.equal(dt, 1 / 60);
});

test('端数はアキュムレータに繰り越される', () => {
  const calls = [];
  const loop = createLoop({ fixedStep: 1 / 60, update: (dt) => calls.push(dt) });
  loop.tick(0.5 / 60);
  assert.equal(calls.length, 0);
  loop.tick(0.6 / 60);
  assert.equal(calls.length, 1);
});

test('delta は maxDelta でクランプされ spiral of death を防ぐ', () => {
  const calls = [];
  const loop = createLoop({
    fixedStep: 1 / 60,
    maxDelta: 0.1,
    update: (dt) => calls.push(dt),
  });
  loop.tick(5.0); // タブ復帰などの巨大 delta
  assert.ok(calls.length <= Math.ceil(0.1 / (1 / 60)) + 1);
});

test('render は tick ごとに 1 回、補間係数 alpha(0..1) 付きで呼ばれる', () => {
  const alphas = [];
  const loop = createLoop({
    fixedStep: 1 / 60,
    update: () => {},
    render: (alpha) => alphas.push(alpha),
  });
  loop.tick(1.5 / 60);
  assert.equal(alphas.length, 1);
  assert.ok(alphas[0] >= 0 && alphas[0] < 1);
});

test('pause 中は update が呼ばれず、resume 後に accumulator が持ち越されない', () => {
  const calls = [];
  const loop = createLoop({ fixedStep: 1 / 60, update: (dt) => calls.push(dt) });
  loop.pause();
  loop.tick(10 / 60);
  assert.equal(calls.length, 0);
  loop.resume();
  loop.tick(1 / 60);
  assert.equal(calls.length, 1);
});

test('経過ゲーム時間 elapsed が実時間に 1 ステップ以内で追随する', () => {
  // accumulator パターンは浮動小数点残差で ±1 ステップの揺れを持つのが正しい挙動
  const loop = createLoop({ fixedStep: 1 / 60, update: () => {} });
  for (let i = 0; i < 10; i += 1) loop.tick(1 / 60); // 通常フレーム相当(クランプ非発動)
  assert.ok(Math.abs(loop.elapsed() - 10 / 60) <= 1 / 60);
});
