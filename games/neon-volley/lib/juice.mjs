// Game juice ユーティリティ (principles.md #6): カメラ揺れ / ヒットストップ / パーティクルバースト。
// three.js には Points/BufferGeometry のみ依存(importmap の 'three' を利用)。
import * as THREE from 'three';

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
    offset() {
      const power = trauma * trauma;
      return {
        x: (Math.random() * 2 - 1) * 0.4 * power,
        y: (Math.random() * 2 - 1) * 0.4 * power,
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
    // dt を通すと、停止中は 0(または縮小)を返す
    scale(dt) {
      if (remaining <= 0) return dt;
      remaining -= dt;
      return dt * 0.05;
    },
  };
}

// パーティクルバースト: プール式・additive の Points 1 draw call
export function createBurstPool(scene, { count = 200, color = 0xffcc66, size = 0.12 } = {}) {
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const life = new Float32Array(count);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
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
  let cursor = 0;

  return {
    burst(origin, amount = 24, speed = 4) {
      for (let i = 0; i < amount; i += 1) {
        const idx = cursor;
        cursor = (cursor + 1) % count;
        positions[idx * 3] = origin.x;
        positions[idx * 3 + 1] = origin.y;
        positions[idx * 3 + 2] = origin.z;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const v = speed * (0.4 + Math.random() * 0.6);
        velocities[idx * 3] = v * Math.sin(phi) * Math.cos(theta);
        velocities[idx * 3 + 1] = v * Math.cos(phi);
        velocities[idx * 3 + 2] = v * Math.sin(phi) * Math.sin(theta);
        life[idx] = 1;
      }
    },
    update(dt) {
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
      material.opacity = 1;
      geometry.attributes.position.needsUpdate = true;
      return alive;
    },
  };
}

// easing 定番セット
export const easeOutCubic = (t) => 1 - (1 - t) ** 3;
export const easeOutBack = (t) => 1 + 2.7 * (t - 1) ** 3 + 1.7 * (t - 1) ** 2;
export const lerp = (a, b, t) => a + (b - a) * t;
