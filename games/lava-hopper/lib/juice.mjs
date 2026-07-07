// Game juice ユーティリティ (principles.md #6): カメラ揺れ / ヒットストップ / パーティクル。
// v2: パーティクルの「物理更新」(createParticlePool、three 非依存・TDD 対象)と
// 「three.js への描画反映」(attachParticlePoolToScene / createBurstPool)を分離。
// three.js は adapter 部分でのみ動的 import する(lib のロジック部を node:test 可能に保つ)。

// カメラ揺れ: update(dt) で減衰し、offset を毎フレームカメラ位置に加算する
export function createShake() {
  let trauma = 0;
  return {
    add(amount) {
      trauma = Math.min(1, trauma + amount);
    },
    update(dt) {
      trauma = Math.max(0, trauma - dt * 1.8);
    },
    offset(rngNext = Math.random) {
      const power = trauma * trauma;
      return {
        x: (rngNext() * 2 - 1) * 0.4 * power,
        y: (rngNext() * 2 - 1) * 0.4 * power,
      };
    },
    active: () => trauma > 0,
  };
}

// ヒットストップ: 打撃の「重さ」を一瞬のタイムスケール低下で表現
export function createHitstop() {
  let remaining = 0;
  return {
    trigger(duration = 0.08) {
      remaining = Math.max(remaining, duration);
    },
    // dt を通すと、停止中は縮小した dt を返す
    scale(dt) {
      if (remaining <= 0) return dt;
      remaining -= dt;
      return dt * 0.05;
    },
  };
}

// パーティクルプール(three 非依存の物理更新のみ)。
// positions/life は Float32Array を直接公開し、描画反映は adapter が担う。
export function createParticlePool(count = 200) {
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const life = new Float32Array(count);
  let cursor = 0;

  return {
    positions,
    life,
    count,
    spawn(origin, amount = 24, speed = 4, rngNext = Math.random) {
      for (let i = 0; i < amount; i += 1) {
        const idx = cursor;
        cursor = (cursor + 1) % count;
        positions[idx * 3] = origin.x;
        positions[idx * 3 + 1] = origin.y;
        positions[idx * 3 + 2] = origin.z;
        const theta = rngNext() * Math.PI * 2;
        const phi = Math.acos(rngNext() * 2 - 1);
        const v = speed * (0.4 + rngNext() * 0.6);
        velocities[idx * 3] = v * Math.sin(phi) * Math.cos(theta);
        velocities[idx * 3 + 1] = v * Math.cos(phi);
        velocities[idx * 3 + 2] = v * Math.sin(phi) * Math.sin(theta);
        life[idx] = 1;
      }
    },
    step(dt) {
      let alive = 0;
      for (let i = 0; i < count; i += 1) {
        if (life[i] <= 0) continue;
        life[i] -= dt * 1.6;
        alive += 1;
        positions[i * 3] += velocities[i * 3] * dt;
        positions[i * 3 + 1] += velocities[i * 3 + 1] * dt;
        positions[i * 3 + 2] += velocities[i * 3 + 2] * dt;
        velocities[i * 3 + 1] -= 6 * dt; // 重力
        if (life[i] <= 0) positions[i * 3 + 1] = -9999; // 画面外へ
      }
      return { positions, alive };
    },
  };
}

// three.js への結線 adapter(engine 差し替え時はここだけ別実装にする)
export async function attachParticlePoolToScene(pool, scene, { color = 0xffcc66, size = 0.12 } = {}) {
  const THREE = await import('three');
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(pool.positions, 3));
  const material = new THREE.PointsMaterial({
    color,
    size,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  scene.add(points);
  return {
    // 毎フレーム: pool.step(dt) の後に呼んで描画バッファを更新する
    sync() {
      geometry.attributes.position.needsUpdate = true;
    },
  };
}

// 後方互換 API(fork 済みゲームが使用中)。内部を pool + adapter 構成に置換。
// 既存呼び出し形状 burst(origin, amount, speed) / update(dt) を維持する。
export function createBurstPool(scene, { count = 200, color = 0xffcc66, size = 0.12 } = {}) {
  const pool = createParticlePool(count);
  let adapter = null; // three の動的 import 解決後に同期 sync に切り替わる(初回フレームのみ遅延)
  attachParticlePoolToScene(pool, scene, { color, size }).then((a) => {
    adapter = a;
  });
  return {
    burst(origin, amount = 24, speed = 4) {
      pool.spawn(origin, amount, speed);
    },
    update(dt) {
      const { alive } = pool.step(dt);
      adapter?.sync();
      return alive;
    },
  };
}

// easing 定番セット
export const easeOutCubic = (t) => 1 - (1 - t) ** 3;
export const easeOutBack = (t) => 1 + 2.7 * (t - 1) ** 3 + 1.7 * (t - 1) ** 2;
export const lerp = (a, b, t) => a + (b - a) * t;
