// 手続き型テクスチャ(T1): シード決定論的な value noise + fbm(principles.md #9 の範囲内)。
// three.js 非依存の純ロジック。ブラウザ側では mapToRGBA の結果を ImageData として
// canvas に put し、THREE.CanvasTexture に渡す(利用例は M7 A/B 実測の variant 参照)。
// 注意: T1 は A/B 実証の対象。rubric 正式軸への採用は実測結果に従う(phase3 §5.3)。
import { createRng } from './rng.mjs';

const smooth = (t) => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;

// 1 オクターブの value noise(グリッド乱数の双線形補間)
function valueNoise(rng, w, h, cell) {
  const gw = Math.ceil(w / cell) + 1;
  const gh = Math.ceil(h / cell) + 1;
  const grid = Float64Array.from({ length: gw * gh }, () => rng.next());
  const out = new Float64Array(w * h);
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const gx = Math.floor(x / cell);
      const gy = Math.floor(y / cell);
      const tx = smooth((x % cell) / cell);
      const ty = smooth((y % cell) / cell);
      const a = grid[gy * gw + gx];
      const b = grid[gy * gw + gx + 1];
      const c = grid[(gy + 1) * gw + gx];
      const d = grid[(gy + 1) * gw + gx + 1];
      out[y * w + x] = lerp(lerp(a, b, tx), lerp(c, d, tx), ty);
    }
  }
  return out;
}

// fbm: 複数オクターブを重ねた滑らかなノイズ場(値域 [0,1])
export function createNoiseField(seed, w, h, { octaves = 3, baseCell = 16 } = {}) {
  const rng = createRng(seed);
  const out = new Float64Array(w * h);
  let amplitude = 1;
  let total = 0;
  for (let o = 0; o < octaves; o += 1) {
    const cell = Math.max(2, Math.round(baseCell / 2 ** o));
    const layer = valueNoise(rng, w, h, cell);
    for (let i = 0; i < out.length; i += 1) out[i] += layer[i] * amplitude;
    total += amplitude;
    amplitude /= 2;
  }
  for (let i = 0; i < out.length; i += 1) out[i] /= total;
  return out;
}

// ノイズ場 → RGBA バッファ(color stops の線形補間)。ImageData.data にそのまま使える。
export function mapToRGBA(field, stops) {
  const sorted = [...stops].sort((a, b) => a.at - b.at);
  const rgba = new Uint8ClampedArray(field.length * 4);
  for (let i = 0; i < field.length; i += 1) {
    const v = field[i];
    let lo = sorted[0];
    let hi = sorted[sorted.length - 1];
    for (let s = 0; s < sorted.length - 1; s += 1) {
      if (v >= sorted[s].at && v <= sorted[s + 1].at) {
        lo = sorted[s];
        hi = sorted[s + 1];
        break;
      }
    }
    const t = hi.at === lo.at ? 0 : (v - lo.at) / (hi.at - lo.at);
    rgba[i * 4] = lerp(lo.color[0], hi.color[0], t);
    rgba[i * 4 + 1] = lerp(lo.color[1], hi.color[1], t);
    rgba[i * 4 + 2] = lerp(lo.color[2], hi.color[2], t);
    rgba[i * 4 + 3] = 255;
  }
  return rgba;
}
