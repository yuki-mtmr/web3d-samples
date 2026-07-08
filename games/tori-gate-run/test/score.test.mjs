import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createScoreStore } from '../lib/score.mjs';

const memStorage = () => {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
  };
};

test('初期ベストは 0', () => {
  const store = createScoreStore('test-game', memStorage());
  assert.equal(store.best(), 0);
});

test('ベスト更新時のみ保存され true を返す', () => {
  const store = createScoreStore('test-game', memStorage());
  assert.equal(store.submit(100), true);
  assert.equal(store.best(), 100);
  assert.equal(store.submit(50), false);
  assert.equal(store.best(), 100);
});

test('storage に永続化され別インスタンスから読める', () => {
  const storage = memStorage();
  createScoreStore('test-game', storage).submit(42);
  assert.equal(createScoreStore('test-game', storage).best(), 42);
});

test('storage の壊れた値(非数値)は 0 として扱う', () => {
  const storage = memStorage();
  storage.setItem('broken-best', 'NaN garbage');
  assert.equal(createScoreStore('broken', storage).best(), 0);
});

test('storage が例外を投げても落ちない(プライベートモード対策)', () => {
  const throwing = {
    getItem: () => { throw new Error('denied'); },
    setItem: () => { throw new Error('denied'); },
  };
  const store = createScoreStore('test-game', throwing);
  assert.equal(store.best(), 0);
  assert.equal(store.submit(10), true); // メモリ上では更新される
  assert.equal(store.best(), 10);
});

test('キーは <name>-best 形式で分離される', () => {
  const storage = memStorage();
  createScoreStore('game-a', storage).submit(1);
  createScoreStore('game-b', storage).submit(2);
  assert.equal(createScoreStore('game-a', storage).best(), 1);
  assert.equal(createScoreStore('game-b', storage).best(), 2);
});
