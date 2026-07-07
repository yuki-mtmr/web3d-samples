// 固定タイムステップのゲームループ (principles.md #1)
// tick(delta) を rAF/setAnimationLoop から呼ぶ。update は fixedStep 幅で決定論的に進む。
export function createLoop({ fixedStep = 1 / 60, maxDelta = 0.1, update, render }) {
  if (typeof update !== 'function') throw new Error('createLoop: update is required');
  let accumulator = 0;
  let elapsed = 0;
  let paused = false;

  return {
    tick(delta) {
      if (paused) return;
      accumulator += Math.min(delta, maxDelta);
      while (accumulator >= fixedStep) {
        update(fixedStep);
        accumulator -= fixedStep;
        elapsed += fixedStep;
      }
      if (render) render(accumulator / fixedStep);
    },
    pause() {
      paused = true;
    },
    resume() {
      paused = false;
      accumulator = 0; // ポーズ中の実時間を持ち越さない
    },
    elapsed: () => elapsed,
    isPaused: () => paused,
  };
}
