// 物理ヘルパー(C2 連続操作・物理クラスタの基盤、C1 の衝突判定にも利用可)。
// three.js 非依存の純関数。breakout-neon の高速時トンネリング(phase1 指摘)への恒久対策として
// swept 判定を提供する。AABB は { min: {x,y,z}, max: {x,y,z} } 形式。

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// 球と AABB の静的交差(最近接点との距離で判定)
export function sphereIntersectsAABB(center, radius, box) {
  const cx = clamp(center.x, box.min.x, box.max.x);
  const cy = clamp(center.y, box.min.y, box.max.y);
  const cz = clamp(center.z, box.min.z, box.max.z);
  const dx = center.x - cx;
  const dy = center.y - cy;
  const dz = center.z - cz;
  return dx * dx + dy * dy + dz * dz <= radius * radius;
}

// 速度の反射(新しいオブジェクトを返す。restitution は反発係数 0..1)
export function reflect(velocity, normal, restitution = 1) {
  const dot = velocity.x * normal.x + velocity.y * normal.y + velocity.z * normal.z;
  return {
    x: (velocity.x - 2 * dot * normal.x) * (normal.x !== 0 ? restitution : 1),
    y: (velocity.y - 2 * dot * normal.y) * (normal.y !== 0 ? restitution : 1),
    z: (velocity.z - 2 * dot * normal.z) * (normal.z !== 0 ? restitution : 1),
  };
}

// swept 球 vs AABB: 1 ステップの移動経路(from→to)が箱に触れるか。
// 経路をサブサンプリングして静的判定を繰り返す(高速移動のトンネリング検出)。
// サンプル間隔は radius の半分以下にし、貫通の見逃しを防ぐ。
export function sweptSphereHitsAABB(from, to, radius, box) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dz = to.z - from.z;
  const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const steps = Math.max(1, Math.ceil(dist / Math.max(radius * 0.5, 1e-6)));
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const p = { x: from.x + dx * t, y: from.y + dy * t, z: from.z + dz * t };
    if (sphereIntersectsAABB(p, radius, box)) return true;
  }
  return false;
}
