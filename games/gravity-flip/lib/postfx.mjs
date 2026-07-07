// ポストプロセス opt-in (principles.md #8/#9): emissive を多用するテーマ(ネオン/発光系)は
// bloom を有効化すること。単色発光のみで bloom を入れない実装は verify N9 の「テーマ矛盾」減点対象。
// 注意: bloom 有効時は resize ハンドラで必ず resize(w, h) を呼ぶこと(N9 が composer.setSize
// 追随を静的検査する)。WebGL 依存のため composer 生成自体は unit test 対象外(TDD opt-out)。
import { Vector2 } from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

export function createBloomComposer(renderer, scene, camera, {
  strength = 0.8,
  radius = 0.4,
  threshold = 0.75,
  width = globalThis.innerWidth ?? 1,
  height = globalThis.innerHeight ?? 1,
} = {}) {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new UnrealBloomPass(new Vector2(width, height), strength, radius, threshold));
  return {
    composer,
    resize(w, h) {
      composer.setSize(w, h);
    },
    // ゲーム側は renderer.render() の代わりにこちらを毎フレーム呼ぶ
    render() {
      composer.render();
    },
  };
}
