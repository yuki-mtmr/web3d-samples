// DOM イベント → InputBuffer の結線層 (principles.md #3)。ロジックは input.mjs に分離済み。
// 戻り値の dispose() で全リスナーを解除できる(FSM の状態遷移と対応付ける)。

export function bindKeyboard(input, keymap, target = window) {
  // keymap 例: { ArrowLeft: 'left', a: 'left', ' ': 'action' }
  const resolve = (e) => keymap[e.key] ?? keymap[e.code];
  const onDown = (e) => {
    const action = resolve(e);
    if (!action) return;
    e.preventDefault();
    input.down(action);
  };
  const onUp = (e) => {
    const action = resolve(e);
    if (action) input.up(action);
  };
  target.addEventListener('keydown', onDown);
  target.addEventListener('keyup', onUp);
  return {
    dispose() {
      target.removeEventListener('keydown', onDown);
      target.removeEventListener('keyup', onUp);
    },
  };
}

export function bindPointer(input, element, { swipeThreshold = 30 } = {}) {
  // タップ → 'action' press、スワイプ → 'left'/'right'/'up'/'down' press
  // 水平ドラッグ量は input.pointerX (0..1 正規化) として毎フレーム参照可能
  let startX = 0;
  let startY = 0;
  let active = false;

  const onDown = (e) => {
    active = true;
    startX = e.clientX;
    startY = e.clientY;
    input.pointerX = e.clientX / element.clientWidth;
  };
  const onMove = (e) => {
    input.pointerX = e.clientX / element.clientWidth;
    if (!active) return;
  };
  const onUp = (e) => {
    if (!active) return;
    active = false;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.abs(dx) < swipeThreshold && Math.abs(dy) < swipeThreshold) {
      input.press('action');
    } else if (Math.abs(dx) > Math.abs(dy)) {
      input.press(dx > 0 ? 'right' : 'left');
    } else {
      input.press(dy > 0 ? 'down' : 'up');
    }
  };

  element.addEventListener('pointerdown', onDown);
  element.addEventListener('pointermove', onMove);
  element.addEventListener('pointerup', onUp);
  return {
    dispose() {
      element.removeEventListener('pointerdown', onDown);
      element.removeEventListener('pointermove', onMove);
      element.removeEventListener('pointerup', onUp);
    },
  };
}

// --- 連続値入力(C2 連続操作・物理クラスタの主 API、phase4-foundation §3.4) ---

// client 座標 → 要素サイズ非依存の 0..1 正規化(範囲外はクランプ)。純関数(TDD 対象)。
export function normalizePointer(clientX, clientY, rect) {
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  return {
    x: clamp01((clientX - rect.left) / rect.width),
    y: clamp01((clientY - rect.top) / rect.height),
  };
}

// ポインタ位置を毎フレーム連続値として公開(input.pointerNormX / pointerNormY、0..1)。
// tilt-maze の「絶対座標依存」(phase1)を正規化座標に統一して解消する。
export function bindContinuousPointer(input, element) {
  const onMove = (e) => {
    const n = normalizePointer(e.clientX, e.clientY, element.getBoundingClientRect());
    input.pointerNormX = n.x;
    input.pointerNormY = n.y;
  };
  element.addEventListener('pointermove', onMove);
  return { unbind: () => element.removeEventListener('pointermove', onMove) };
}

// デバイス傾き → input.tiltX / tiltY(-1..1)。iOS 13+ は初回ユーザー操作内で
// requestTiltPermission() を呼ぶこと(opt-in、C2 の傾き操作系のみが使う)。
export function bindDeviceTilt(input, { sensitivity = 1, maxDeg = 30 } = {}) {
  const onTilt = (e) => {
    input.tiltX = Math.max(-1, Math.min(1, ((e.gamma ?? 0) / maxDeg) * sensitivity));
    input.tiltY = Math.max(-1, Math.min(1, ((e.beta ?? 0) / maxDeg) * sensitivity));
  };
  window.addEventListener('deviceorientation', onTilt);
  return { unbind: () => window.removeEventListener('deviceorientation', onTilt) };
}

export async function requestTiltPermission() {
  const D = globalThis.DeviceOrientationEvent;
  if (D?.requestPermission) return (await D.requestPermission()) === 'granted';
  return Boolean(D);
}
