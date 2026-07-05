# sites/ — 3D サンプルサイト集

3D 表現 × 異なるデザイン方向性のサンプルサイト 5 種。すべて単一 `index.html` 完結（ビルド不要）、three.js は CDN import map で読み込む。

## 起動

```bash
# リポジトリルートから
python3 -m http.server 8770
# → http://localhost:8770/sites/ （ハブページから各サイトへ）
```

`file://` では ES modules が動かないため必ず HTTP サーバー経由で開く。

## 一覧

| サイト | デザイン方向性 | 3D 技法 |
|---|---|---|
| `glass-hero/` | ガラスモーフィズム（ライト） | Draco 圧縮 GLB + KHR transmission + RoomEnvironment |
| `particle-field/` | ダークラグジュアリー | 12,000 頂点の Points 波動 + マウス視差 |
| `scrolly-story/` | エディトリアル / Swiss | スクロール進捗で回転・ドリー・色補間を駆動 |
| `bento-lab/` | ネオブルータリズム | 1 ページに独立 3 canvas（ResizeObserver 管理） |
| `retro-terrain/` | レトロフューチャー | PlaneGeometry 頂点変形の無限地形 + フォグ |

## 共通実装ルール

- import map: `three@0.160.0`（unpkg）+ `three/addons/`
- `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))`、リサイズ対応
- `prefers-reduced-motion: reduce` で自動アニメーションを停止
- 初回フレーム後に `console.log('[site] ready')`（動作確認用フック）
- 水平オーバーフローなし、CSS カスタムプロパティでパレット管理

## ハマりどころ（実際に踏んだもの）

- **metalness 0.9 + 環境マップなし → ほぼ黒**になり背景に溶ける。`RoomEnvironment` を `scene.environment` に設定する
- **`html, body { height: 100% }` はスクロールを殺す**。`scrollHeight - innerHeight = 0` になり scroll progress が `0/0 = NaN` → メッシュの行列が NaN で消える。`min-height` を使う
- **Fog の near が近すぎるとワイヤーフレームが霧色に沈む**。背景色と同系だと完全に不可視になる
- **CircleGeometry はデフォルトで +Z 向き**。カメラに向けるなら回転不要。`BackSide` 指定すると正面から見えなくなる
- **透過（transmission）は EEVEE 同様ヘッドレス GPU でも乳白色に近似**される。実 GPU ブラウザで最終確認する
