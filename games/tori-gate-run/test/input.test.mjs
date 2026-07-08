import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createInputBuffer } from '../lib/input.mjs';

test('press は consume まで保持され、取りこぼされない', () => {
  const input = createInputBuffer();
  input.press('jump');
  const pressed = input.consumePressed();
  assert.ok(pressed.has('jump'));
});

test('consume 後はバッファが空になる(一回性)', () => {
  const input = createInputBuffer();
  input.press('jump');
  input.consumePressed();
  assert.equal(input.consumePressed().size, 0);
});

test('同一フレーム内の複数 press をすべて保持する', () => {
  const input = createInputBuffer();
  input.press('left');
  input.press('fire');
  const pressed = input.consumePressed();
  assert.ok(pressed.has('left') && pressed.has('fire'));
  assert.equal(pressed.size, 2);
});

test('down/up で held(押しっぱなし)状態を追跡する', () => {
  const input = createInputBuffer();
  input.down('left');
  assert.ok(input.isHeld('left'));
  input.up('left');
  assert.ok(!input.isHeld('left'));
});

test('down は press も記録する(押した瞬間の検出)', () => {
  const input = createInputBuffer();
  input.down('jump');
  assert.ok(input.consumePressed().has('jump'));
});

test('down 連打(キーリピート)では press は初回のみ記録', () => {
  const input = createInputBuffer();
  input.down('jump');
  input.down('jump'); // OS キーリピート
  const pressed = input.consumePressed();
  assert.ok(pressed.has('jump'));
  input.up('jump');
  input.down('jump');
  assert.ok(input.consumePressed().has('jump'));
});

test('axis(): held 状態から -1/0/+1 の軸値を導出する', () => {
  const input = createInputBuffer();
  assert.equal(input.axis('left', 'right'), 0);
  input.down('right');
  assert.equal(input.axis('left', 'right'), 1);
  input.down('left'); // 同時押しは相殺
  assert.equal(input.axis('left', 'right'), 0);
  input.up('right');
  assert.equal(input.axis('left', 'right'), -1);
});

test('reset() で held/pressed が全クリアされる(状態遷移時のリーク防止)', () => {
  const input = createInputBuffer();
  input.down('left');
  input.press('fire');
  input.reset();
  assert.ok(!input.isHeld('left'));
  assert.equal(input.consumePressed().size, 0);
});
