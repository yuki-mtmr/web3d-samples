// ベストスコア永続化 (principles.md #5)。storage は注入可能(テスト/プライベートモード対応)。
export function createScoreStore(name, storage = globalThis.localStorage) {
  const key = `${name}-best`;

  const read = () => {
    try {
      const value = Number(storage.getItem(key));
      return Number.isFinite(value) && value > 0 ? value : 0;
    } catch {
      return 0;
    }
  };

  let cached = read();

  return {
    best: () => cached,
    submit(score) {
      if (score <= cached) return false;
      cached = score;
      try {
        storage.setItem(key, String(score));
      } catch {
        // プライベートモード等で保存不可でもゲームは継続する
      }
      return true;
    },
  };
}
