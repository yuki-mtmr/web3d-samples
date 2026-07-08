# Theme Sheet: B18 Shadow Thief

## [FIXED] Palette (brief.json より転記・変更不可)
- primary: #38f2c6
- accent: #dfe9f2
- background: #060810
- danger: #ff6a3d

## [FIXED] Mood keywords
- 都市夜景
- 発光
- ミニマル

## [FIXED] Prohibitions(実装中は毎回この一覧を再確認すること)
- 外部テクスチャ画像の使用
- bloom 不在での emissive 多用
- プレイヤーが背景に埋没する配色

## [DERIVE] Camera
俯瞰固定。サーチライトの回転パターン全体が読める高さを維持。

## [DERIVE] Lighting
サーチライト扇形の emissive が主光源。プレイヤー(シアン)は常に背景より 3:1 以上のコントラストを保つ(prohibitions 対応)。

## [DERIVE] Material
T0: プレイヤー=Cone、宝石=Octahedron + 高 emissive、ライト=扇形メッシュ半透明。

## [DERIVE] Background decoration
1) 床グリッドの微発光 2) 壁際の柱シルエット 3) 宝石獲得時の波紋エフェクト。

## [DERIVE] Audio tone
低め・ステルス系。移動=click 小、発見=crash、宝石=rise。audio.mjs プリセット控えめ音量。

## [DERIVE] Juice direction
控えめ(ステルスの緊張感を優先)。被発見時のみ shake 0.5 + hitstop 0.1 で強調。
