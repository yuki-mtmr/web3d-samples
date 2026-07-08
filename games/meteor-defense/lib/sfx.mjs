// 後方互換 shim: 旧 oscillator 実装は lib/audio.mjs(ZzFX ベース)に置き換えられた。
// fork 済みゲームは createSfx() のまま動く(ping/rise/fall/crash/click/setMuted/isMuted/unlock 互換)。
// 新規実装は lib/audio.mjs の createAudio() を直接 import すること。
export { createAudio as createSfx } from './audio.mjs';
