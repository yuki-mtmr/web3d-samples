import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGameHook } from '../lib/game-hook.mjs';
import { createFSM } from '../lib/fsm.mjs';
import { validateGameHook } from '../../../scripts/contracts/validate-game-hook.mjs';

const makeFsm = () =>
  createFSM({ title: {}, playing: {}, paused: {}, gameover: {} }, 'title');

const rendererInfo = () => ({ calls: 12, triangles: 3000 });

test('createGameHook output satisfies the v2 contract validator', () => {
  const hook = createGameHook({
    fsm: makeFsm(),
    state: { score: 0 },
    rendererInfo,
    progressFields: ['score'],
    seedRng: (s) => s,
  });
  const r = validateGameHook(hook);
  assert.equal(r.valid, true, r.errors.join('; '));
});

test('progressFields defaults to empty array (warning-level, not crash)', () => {
  const hook = createGameHook({ fsm: makeFsm(), state: { score: 0 }, rendererInfo });
  assert.deepEqual(hook.progressFields, []);
  const r = validateGameHook(hook);
  assert.equal(r.valid, true);
});

test('missing fsm / state / rendererInfo throws with a clear message', () => {
  assert.throws(() => createGameHook({ state: {}, rendererInfo }), /fsm/);
  assert.throws(() => createGameHook({ fsm: makeFsm(), rendererInfo }), /state/);
  assert.throws(() => createGameHook({ fsm: makeFsm(), state: {} }), /rendererInfo/);
});

test('progressFields is copied, not aliased (immutability)', () => {
  const fields = ['score'];
  const hook = createGameHook({
    fsm: makeFsm(),
    state: { score: 0 },
    rendererInfo,
    progressFields: fields,
  });
  fields.push('injected');
  assert.deepEqual(hook.progressFields, ['score']);
});

test('seedRng passes through when provided', () => {
  const calls = [];
  const hook = createGameHook({
    fsm: makeFsm(),
    state: { score: 0 },
    rendererInfo,
    seedRng: (s) => calls.push(s),
  });
  hook.seedRng(123);
  assert.deepEqual(calls, [123]);
});
