// シード注入可能な決定論的 PRNG (mulberry32、依存ゼロ)。
// verify の bot playthrough(B ゲート)がシード固定で再現テストするための基盤 (principles.md #10)。
// ゲーム内の Math.random() 直接呼び出しはこの rng に置き換え、
// window.__GAME__.seedRng = rng.reseed として契約(docs/contracts/game-hook.d.ts)に接続する。
export function createRng(seed = Date.now() >>> 0) {
  let state = seed >>> 0;

  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  return {
    next, // [0, 1)
    range: (min, max) => min + next() * (max - min), // [min, max)
    int: (min, max) => Math.floor(min + next() * (max - min + 1)), // [min, max] 両端含む
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    reseed(newSeed) {
      state = newSeed >>> 0;
    },
  };
}
