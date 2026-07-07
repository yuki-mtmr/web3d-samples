// 手続き型 SFX (principles.md #6)。既存 games 10 本の oscillator+gain パターンを共通化。
// AudioContext はユーザー操作後に遅延生成(autoplay policy 対応)。mute トグル付き。

export function createSfx() {
  let ctx = null;
  let muted = false;

  const ensure = () => {
    if (!ctx) {
      const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  };

  const tone = ({ freq, endFreq = freq, type = 'sine', duration = 0.12, vol = 0.1 }) => {
    if (muted) return;
    const audio = ensure();
    if (!audio) return;
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    const now = audio.currentTime;
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(endFreq, 1), now + duration);
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain).connect(audio.destination);
    osc.start(now);
    osc.stop(now + duration);
  };

  return {
    // プリセット: 用途名で呼び分ける(ゲームごとの周波数改変は引数で)
    ping: (vol = 0.08) => tone({ freq: 880, type: 'sine', duration: 0.08, vol }),
    rise: (vol = 0.1) => tone({ freq: 300, endFreq: 900, type: 'square', duration: 0.15, vol }),
    fall: (vol = 0.1) => tone({ freq: 600, endFreq: 150, type: 'sawtooth', duration: 0.25, vol }),
    crash: (vol = 0.15) => tone({ freq: 160, endFreq: 40, type: 'sawtooth', duration: 0.4, vol }),
    click: (vol = 0.06) => tone({ freq: 1200, type: 'triangle', duration: 0.04, vol }),
    tone,
    setMuted(value) {
      muted = value;
    },
    isMuted: () => muted,
    unlock: () => void ensure(), // 初回ユーザー操作で呼ぶ
  };
}
