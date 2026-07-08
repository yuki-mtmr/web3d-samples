import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createFSM } from '../lib/fsm.mjs';

const makeStates = (log) => ({
  title: {
    enter: () => log.push('enter:title'),
    exit: () => log.push('exit:title'),
  },
  playing: {
    enter: () => log.push('enter:playing'),
    exit: () => log.push('exit:playing'),
  },
  paused: {},
  gameover: {},
});

test('初期状態の enter が呼ばれる', () => {
  const log = [];
  const fsm = createFSM(makeStates(log), 'title');
  assert.equal(fsm.current(), 'title');
  assert.deepEqual(log, ['enter:title']);
});

test('遷移で exit → enter の順に呼ばれる', () => {
  const log = [];
  const fsm = createFSM(makeStates(log), 'title');
  fsm.transition('playing');
  assert.deepEqual(log, ['enter:title', 'exit:title', 'enter:playing']);
  assert.equal(fsm.current(), 'playing');
});

test('未定義状態への遷移はエラー', () => {
  const fsm = createFSM(makeStates([]), 'title');
  assert.throws(() => fsm.transition('nonexistent'));
});

test('同一状態への遷移は no-op(enter/exit を呼ばない)', () => {
  const log = [];
  const fsm = createFSM(makeStates(log), 'title');
  fsm.transition('title');
  assert.deepEqual(log, ['enter:title']);
});

test('is() で状態判定できる', () => {
  const fsm = createFSM(makeStates([]), 'title');
  assert.ok(fsm.is('title'));
  fsm.transition('playing');
  assert.ok(fsm.is('playing'));
  assert.ok(!fsm.is('title'));
});

test('enter に遷移元、exit に遷移先が渡される', () => {
  const seen = [];
  const fsm = createFSM({
    a: { exit: (to) => seen.push(`a->${to}`) },
    b: { enter: (from) => seen.push(`b<-${from}`) },
  }, 'a');
  fsm.transition('b');
  assert.deepEqual(seen, ['a->b', 'b<-a']);
});

// --- v2 契約: fsm.state getter (docs/contracts/game-hook.d.ts) ---
test('fsm.state getter always equals current()', () => {
  const fsm = createFSM({ title: {}, playing: {} }, 'title');
  assert.equal(fsm.state, 'title');
  assert.equal(fsm.state, fsm.current());
  fsm.transition('playing');
  assert.equal(fsm.state, 'playing');
  assert.equal(fsm.state, fsm.current());
});

test('fsm.state is read-only (assignment does not desync)', () => {
  const fsm = createFSM({ title: {}, playing: {} }, 'title');
  try {
    fsm.state = 'playing';
  } catch {
    // strict mode では TypeError、非 strict では無視 — どちらも許容
  }
  assert.equal(fsm.state, 'title');
});
