// window.__GAME__ 契約 v2 の組み立てヘルパー (docs/contracts/game-hook.d.ts)。
// 手書きオブジェクトリテラルでの必須フィールド書き漏らし(neon-volley 型)を構造的に防ぐ。
// 使い方: window.__GAME__ = createGameHook({ fsm, state, rendererInfo, progressFields: ['score'], seedRng: rng.reseed });
export function createGameHook({ fsm, state, rendererInfo, progressFields = [], seedRng } = {}) {
  if (!fsm || typeof fsm.current !== 'function') {
    throw new Error('createGameHook: fsm (createFSM の戻り値) is required');
  }
  if (state === null || typeof state !== 'object') {
    throw new Error('createGameHook: state object is required');
  }
  if (typeof rendererInfo !== 'function') {
    throw new Error('createGameHook: rendererInfo function is required');
  }
  if (seedRng !== undefined && typeof seedRng !== 'function') {
    throw new Error('createGameHook: seedRng must be a function when provided');
  }

  const hook = {
    fsm,
    state,
    rendererInfo,
    progressFields: Object.freeze([...progressFields]),
  };
  if (seedRng) hook.seedRng = seedRng;
  return hook;
}
