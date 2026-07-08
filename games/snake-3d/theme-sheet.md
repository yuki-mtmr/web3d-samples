# Theme Sheet: B28 Neon Snake 3D

## [FIXED] Palette (brief.json より転記・変更不可)
- primary: #4ade80
- accent: #ff2d8a
- background: #071410
- danger: #ff4d4d

## [FIXED] Mood keywords
- 高彩度
- 発光

## [FIXED] Prohibitions(実装中は毎回この一覧を再確認すること)
- 外部テクスチャ画像の使用
- 背景を暗緑系ネオンから外れた配色にすること
- ヘビ・フルーツの emissive 発光を落とした低彩度表現

## [DERIVE] Camera
固定俯瞰(PerspectiveCamera fov46)。盤面中心の斜め上(0, 16.5, 10.5)から (0, 0, -0.6) を注視する見下ろし構図で盤面全体を常時視野に収める。C1(離散トラバース)の定石通り、追従なし・揺れなしの静的固定カメラ。

## [DERIVE] Lighting
AmbientLight(0x88ffcc, 0.55, 淡緑)+ DirectionalLight(0xffffff, 1.1)。影は無効(shadows: false)。ヘビ頭部(emissive 0x4ade80 強度0.8)・胴体(emissive 0x1a7a44 強度0.4)・外周ネオン枠(emissive 0x22c55e 強度1.1)・実(emissive 0xff2d8a 強度1.2)がそれぞれ自己発光で盤面のコントラストを作る。

## [DERIVE] Material
T1: 床は CanvasTexture による市松グリッド(#0d211a/#0a1b15 の 2 色 + 発光グリッド線 rgba(74,222,128,0.14))で procedural に生成。ヘビ頭部・胴体・実・外周枠は primitive(BoxGeometry/SphereGeometry) + MeshStandardMaterial(emissive)のみで構成し、glTF プロップは使用しない。

## [DERIVE] Background decoration
1) 市松グリッド床(procedural CanvasTexture) 2) 外周ネオン枠(発光 Box 4 本で盤面境界を明示) 3) 浮遊・自転する実(sin 波での上下浮遊 + y軸回転) 4) Fog(0x071410, 24-50)による奥行き減衰。

## [DERIVE] Audio tone
mood「高彩度・発光」に合わせ高域中心の明るい音色。実を食べた時は triangle 波 660→1320Hz の上昇音(eatSfx)、ゲームオーバー時は sawtooth 波 220→50Hz の下降音(crashSfx)。lib/audio.mjs 未使用、WebAudio 直書きの現状を維持。

## [DERIVE] Juice direction
控えめ〜中程度。画面 shake やヒットストップは無く、実を食べた時の上昇音+スコア更新、衝突時の下降音+0.5秒遅延後のオーバーレイ表示のみで演出する。ネオン系の派手さは発光マテリアルと色そのものに委ね、モーション演出は最小限に抑える現行方針を維持。
