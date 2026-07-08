// 入力バッファ: イベント側で即記録し、fixed update 先頭で consume する (principles.md #3)
// DOM 非依存の純粋ロジック。DOM への結線は input-bindings.mjs が担う。
export function createInputBuffer() {
  const pressed = new Set(); // consume までの「押した瞬間」
  const held = new Set(); // 現在押しっぱなしのアクション

  return {
    press(action) {
      pressed.add(action);
    },
    down(action) {
      if (!held.has(action)) pressed.add(action); // キーリピートを弾く
      held.add(action);
    },
    up(action) {
      held.delete(action);
    },
    isHeld: (action) => held.has(action),
    axis: (negative, positive) => (held.has(positive) ? 1 : 0) - (held.has(negative) ? 1 : 0),
    consumePressed() {
      const out = new Set(pressed);
      pressed.clear();
      return out;
    },
    reset() {
      pressed.clear();
      held.clear();
    },
  };
}
