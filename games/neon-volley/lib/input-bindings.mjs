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
