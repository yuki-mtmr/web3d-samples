import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRamp, createEventSchedule } from '../lib/difficulty.mjs';

test('ramp: 時間経過で base から線形に増加する', () => {
  const ramp = createRamp({ base: 10, perSecond: 2 });
  assert.equal(ramp.at(0), 10);
  assert.equal(ramp.at(5), 20);
});

test('ramp: max でクランプされる', () => {
  const ramp = createRamp({ base: 10, perSecond: 2, max: 16 });
  assert.equal(ramp.at(100), 16);
});

test('ramp: 負の perSecond で減少ランプ(スポーン間隔短縮など)も作れる', () => {
  const ramp = createRamp({ base: 2.0, perSecond: -0.1, min: 0.5 });
  assert.equal(ramp.at(5), 1.5);
  assert.equal(ramp.at(100), 0.5);
});

test('event schedule: 経過時間までの未発火イベントを一度だけ返す', () => {
  const schedule = createEventSchedule([
    { at: 10, name: 'wave2' },
    { at: 30, name: 'boss' },
  ]);
  assert.deepEqual(schedule.fire(5), []);
  assert.deepEqual(schedule.fire(12).map((e) => e.name), ['wave2']);
  assert.deepEqual(schedule.fire(15), []); // 二重発火しない
  assert.deepEqual(schedule.fire(31).map((e) => e.name), ['boss']);
});

test('event schedule: 複数イベントを一括通過した場合は at 順に返す', () => {
  const schedule = createEventSchedule([
    { at: 30, name: 'boss' },
    { at: 10, name: 'wave2' },
  ]);
  assert.deepEqual(schedule.fire(60).map((e) => e.name), ['wave2', 'boss']);
});

test('event schedule: reset で再発火可能になる(リスタート対応)', () => {
  const schedule = createEventSchedule([{ at: 10, name: 'wave2' }]);
  schedule.fire(20);
  schedule.reset();
  assert.deepEqual(schedule.fire(20).map((e) => e.name), ['wave2']);
});
