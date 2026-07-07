// SFX (principles.md #6): ZzFX ベースのプリセット辞書 + mute。
// 旧 lib/sfx.mjs(oscillator 手書き)の後継。API 形状(ping/rise/fall/crash/click/setMuted/
// isMuted/unlock)を維持し、fork 済みゲームの書き換えコストをゼロにする。
// ZzFX 本体は lib/vendor/zzfx.mjs に MIT ライセンス表記ごとベンダリング(CDN 依存なし)。
import { zzfx, ZZFX } from './vendor/zzfx.mjs';

// [volume, randomness, frequency, attack, sustain, release, shape, shapeCurve, ...] (ZzFX 形式)
export const PRESETS = Object.freeze({
  ping:  [0.08, 0, 880, 0, 0.02, 0.08, 0, 1.2],
  click: [0.06, 0, 1200, 0, 0.01, 0.04, 2, 1],
  crash: [0.15, 0, 160, 0, 0.1, 0.4, 3, 2.5, 0, 0, -30, 0, 0, 0.3],
  rise:  [0.1, 0, 300, 0, 0.05, 0.15, 1, 1, 0, 0, 600, 0.05],
  fall:  [0.1, 0, 600, 0, 0.05, 0.25, 3, 1, 0, -150],
});

// playFn はテスト用注入ポイント(既定は ZzFX 本体)。発音そのものは聴覚検証で担保する。
export function createAudio({ playFn = zzfx } = {}) {
  let muted = false;

  // vol 指定時はプリセットの音量(先頭要素)だけを差し替える(旧 sfx.ping(0.03) 互換)
  const play = (name, vol) => {
    if (muted || !PRESETS[name]) return;
    const [presetVol, ...rest] = PRESETS[name];
    playFn(vol ?? presetVol, ...rest);
  };

  return {
    play,
    // 旧 sfx.mjs 互換のプリセット直呼び名(音量引数も互換)
    ping: (vol) => play('ping', vol),
    rise: (vol) => play('rise', vol),
    fall: (vol) => play('fall', vol),
    crash: (vol) => play('crash', vol),
    click: (vol) => play('click', vol),
    setMuted(value) {
      muted = value;
    },
    isMuted: () => muted,
    // autoplay policy 対応: 初回ユーザー操作で呼ぶ(suspended な AudioContext を再開)
    unlock() {
      ZZFX.audioContext?.resume?.();
    },
  };
}
