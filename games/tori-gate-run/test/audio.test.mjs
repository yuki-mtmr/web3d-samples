import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createAudio, PRESETS } from '../lib/audio.mjs';

test('PRESETS provides the five legacy sfx names with ZzFX parameter arrays', () => {
  for (const name of ['ping', 'rise', 'fall', 'crash', 'click']) {
    assert.ok(Array.isArray(PRESETS[name]), `${name} missing`);
    assert.equal(typeof PRESETS[name][0], 'number', `${name} volume must be number`);
  }
});

test('play() invokes the injected player with preset parameters', () => {
  const played = [];
  const audio = createAudio({ playFn: (...p) => played.push(p) });
  audio.play('ping');
  assert.equal(played.length, 1);
  assert.deepEqual(played[0], PRESETS.ping);
});

test('play() while muted is a no-op', () => {
  const played = [];
  const audio = createAudio({ playFn: (...p) => played.push(p) });
  audio.setMuted(true);
  audio.play('ping');
  audio.ping();
  assert.equal(played.length, 0);
  assert.equal(audio.isMuted(), true);
});

test('play() with unknown preset name does not throw', () => {
  const audio = createAudio({ playFn: () => {} });
  assert.doesNotThrow(() => audio.play('no-such-sound'));
});

test('legacy method names (sfx.mjs 互換) are callable', () => {
  const played = [];
  const audio = createAudio({ playFn: (...p) => played.push(p) });
  audio.ping();
  audio.rise();
  audio.fall();
  audio.crash();
  audio.click();
  assert.equal(played.length, 5);
});

test('legacy volume argument overrides preset volume (旧 sfx.ping(0.03) 互換)', () => {
  const played = [];
  const audio = createAudio({ playFn: (...p) => played.push(p) });
  audio.ping(0.03);
  assert.equal(played[0][0], 0.03, 'volume must be overridden');
  assert.deepEqual(played[0].slice(1), PRESETS.ping.slice(1), 'non-volume params must stay preset');
});

test('legacy call without volume uses preset volume', () => {
  const played = [];
  const audio = createAudio({ playFn: (...p) => played.push(p) });
  audio.crash();
  assert.equal(played[0][0], PRESETS.crash[0]);
});

test('unlock() exists and does not throw outside the browser', () => {
  const audio = createAudio({ playFn: () => {} });
  assert.doesNotThrow(() => audio.unlock());
});
