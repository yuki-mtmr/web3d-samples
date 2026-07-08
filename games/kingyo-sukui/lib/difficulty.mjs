// データ駆動の難易度曲線 (principles.md #7)
// 数値ランプ(速度・密度・間隔)と質的イベント(ボス・環境変化)を分離して持つ。

export function createRamp({ base, perSecond = 0, min = -Infinity, max = Infinity }) {
  if (typeof base !== 'number') throw new Error('createRamp: base is required');
  return {
    at: (t) => Math.min(max, Math.max(min, base + perSecond * t)),
  };
}

export function createEventSchedule(events) {
  const sorted = [...events].sort((a, b) => a.at - b.at);
  let cursor = 0;

  return {
    fire(t) {
      const due = [];
      while (cursor < sorted.length && sorted[cursor].at <= t) {
        due.push(sorted[cursor]);
        cursor += 1;
      }
      return due;
    },
    reset() {
      cursor = 0;
    },
  };
}
