// render-preset(phase D §1.1): brief.json の renderPreset を解決し、T0 レンダリング設定
// (tone mapping / IBL / 影)をゲームへ適用する。
// - pure 部分(resolveRenderPreset / TONE_MAPPING_PROP)は node --test 対象
// - WebGL 依存部(applyRenderPreset / initRenderPreset)は unit test 対象外(TDD opt-out、verify で検証)
// 必須パターン(phase C 実測): PMREM 焼き込みと影シェーダコンパイルは playing 入場時に遅延する。
// 起動直後に行うと headless で A2(boot≤3s)を割る(gap-ascent-report.md §1)。
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export const TONE_MAPPING_PROP = Object.freeze({
  neutral: 'NeutralToneMapping',
  agx: 'AgXToneMapping',
  acesfilmic: 'ACESFilmicToneMapping',
});

const BACKGROUNDS = ['procedural', 'cc0-equirect', 'gen-image'];
const DEFAULTS = Object.freeze({
  toneMapping: 'neutral', exposure: 1.0, envIntensity: 0.3, shadows: false, background: 'procedural',
});

// brief.renderPreset(部分指定可)を既定値とマージして検証する。brief 側が常に勝つ(phase D §0 規約 4)。
export function resolveRenderPreset(raw) {
  if (raw === undefined || raw === null) return Object.freeze({ ...DEFAULTS });
  const unknown = Object.keys(raw).filter((k) => !(k in DEFAULTS));
  if (unknown.length > 0) throw new Error(`resolveRenderPreset: unknown keys: ${unknown.join(', ')}`);
  const merged = { ...DEFAULTS, ...raw };
  if (!(merged.toneMapping in TONE_MAPPING_PROP)) {
    throw new Error(`resolveRenderPreset: toneMapping must be one of ${Object.keys(TONE_MAPPING_PROP).join('|')}, got ${JSON.stringify(merged.toneMapping)}`);
  }
  if (typeof merged.exposure !== 'number' || !Number.isFinite(merged.exposure) || merged.exposure <= 0) {
    throw new Error(`resolveRenderPreset: exposure must be a finite number > 0, got ${JSON.stringify(merged.exposure)}`);
  }
  if (typeof merged.envIntensity !== 'number' || !Number.isFinite(merged.envIntensity) || merged.envIntensity < 0) {
    throw new Error(`resolveRenderPreset: envIntensity must be a finite number >= 0, got ${JSON.stringify(merged.envIntensity)}`);
  }
  if (typeof merged.shadows !== 'boolean') {
    throw new Error(`resolveRenderPreset: shadows must be a boolean, got ${JSON.stringify(merged.shadows)}`);
  }
  if (!BACKGROUNDS.includes(merged.background)) {
    throw new Error(`resolveRenderPreset: background must be one of ${BACKGROUNDS.join('|')}, got ${JSON.stringify(merged.background)}`);
  }
  return Object.freeze(merged);
}

// 起動時に安全な設定(tone mapping/exposure)だけ即適用し、重い処理(PMREM 焼き込み・影)は
// onPlaying() まで遅延する。onPlaying は冪等(2 回目以降は no-op)。
export function applyRenderPreset(renderer, scene, preset) {
  renderer.toneMapping = THREE[TONE_MAPPING_PROP[preset.toneMapping]];
  renderer.toneMappingExposure = preset.exposure;
  let done = false;
  return {
    preset,
    onPlaying(shadowLight) {
      if (done) return;
      done = true;
      if (preset.envIntensity > 0 && !scene.environment) {
        const pmrem = new THREE.PMREMGenerator(renderer);
        scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
        scene.environmentIntensity = preset.envIntensity;
        pmrem.dispose();
      }
      if (preset.shadows && shadowLight) {
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;
        shadowLight.castShadow = true;
      }
    },
  };
}

// fork 向けの結線ヘルパー(3 行 boilerplate の 1 行目)。brief.json を fetch して適用する。
// brief 取得や解決に失敗した場合は既定 preset に落とすが、console.warn で必ず可視化する
// (サイレントフォールバック禁止 — phase D §0 規約 3。verify N6 の warning 予算で検出可能)。
export async function initRenderPreset(renderer, scene, briefUrl = './brief.json') {
  let preset;
  try {
    const brief = await (await fetch(briefUrl)).json();
    preset = resolveRenderPreset(brief.renderPreset);
  } catch (err) {
    console.warn(`render-preset: falling back to defaults (${err.message})`);
    preset = resolveRenderPreset(undefined);
  }
  return applyRenderPreset(renderer, scene, preset);
}
