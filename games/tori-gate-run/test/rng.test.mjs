import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRng } from '../lib/rng.mjs';

test('same seed produces the same sequence', () => {
  const a = createRng(42);
  const b = createRng(42);
  const seqA = [a.next(), a.next(), a.next(), a.next()];
  const seqB = [b.next(), b.next(), b.next(), b.next()];
  assert.deepEqual(seqA, seqB);
});

test('different seeds produce different sequences', () => {
  const a = createRng(1);
  const b = createRng(2);
  const seqA = [a.next(), a.next(), a.next()];
  const seqB = [b.next(), b.next(), b.next()];
  assert.notDeepEqual(seqA, seqB);
});

test('next() stays in [0, 1)', () => {
  const rng = createRng(7);
  for (let i = 0; i < 1000; i += 1) {
    const v = rng.next();
    assert.ok(v >= 0 && v < 1, `out of range: ${v}`);
  }
});

test('reseed restarts the sequence deterministically', () => {
  const rng = createRng(42);
  const first = [rng.next(), rng.next()];
  rng.reseed(42);
  assert.deepEqual([rng.next(), rng.next()], first);
});

test('range(min, max) stays within bounds', () => {
  const rng = createRng(3);
  for (let i = 0; i < 500; i += 1) {
    const v = rng.range(-5, 5);
    assert.ok(v >= -5 && v < 5);
  }
});

test('int(min, max) is integer and inclusive on both ends', () => {
  const rng = createRng(9);
  const seen = new Set();
  for (let i = 0; i < 2000; i += 1) {
    const v = rng.int(1, 3);
    assert.ok(Number.isInteger(v));
    assert.ok(v >= 1 && v <= 3);
    seen.add(v);
  }
  assert.deepEqual([...seen].sort(), [1, 2, 3]);
});

test('pick returns an element of the array', () => {
  const rng = createRng(5);
  const arr = ['a', 'b', 'c'];
  for (let i = 0; i < 100; i += 1) {
    assert.ok(arr.includes(rng.pick(arr)));
  }
});
