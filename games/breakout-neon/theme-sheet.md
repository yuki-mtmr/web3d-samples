# Theme Sheet: B21 Neon Breakout

## [FIXED] Palette (brief.json より転記・変更不可)
- primary: #c79aff
- accent: #8affda
- background: #120a1c
- danger: #ff7ab8

## [FIXED] Mood keywords
- 高彩度
- 発光
- 都市夜景

## [FIXED] Prohibitions(実装中は毎回この一覧を再確認すること)
- 外部テクスチャ画像の使用
- パステル/低彩度への逸脱(ネオン発光の否定)
- 壁面・パドルの emissive を無効化する暗色変更

## [DERIVE] Camera
固定俯瞰(追従なし)。フィールド(xz 平面、奥行き 16 / 幅 12)を斜め上 (0, 13.5, 9) から見下ろす固定パースペクティブ。パドルは画面下部、ブロックは奥。カメラ揺れなし(ネオン基調は視認性優先、ジターは付けない)。

## [DERIVE] Lighting
AmbientLight(藍紫 0x8877cc, intensity 1.2)+ DirectionalLight(白色 0xffffff, intensity 0.9)の平坦 2 灯構成。影は生成しない(shadows: false)。壁・パドル・ボール・ブロックは全て emissive 付き MeshStandardMaterial で自発光させ、環境光源は補助に留める。

## [DERIVE] Material
T1(procedural 手続き型、外部テクスチャ画像なし): 全オブジェクト primitive + emissive の組み合わせ。壁= BoxGeometry + primary(#c79aff)emissive 0.9、パドル= BoxGeometry + accent(#8affda)emissive 1.0、ボール= SphereGeometry + 白 emissive 0.9、ブロック= BoxGeometry + 6 色(行ごとの ROW_COLORS、danger 系含む)emissive 0.35、床= 暗色 MeshStandardMaterial(非発光、roughness 0.95)。CanvasTexture は使用しない(T1 内でも primitive 表現のみで足りる規模)。

## [DERIVE] Background decoration
1) フィールド外周を囲む発光壁(奥+左右 3 面、primary emissive) 2) ブロック破壊時のパーティクルバースト(14 点、ブロック色を継承し重力落下) 3) HUD のネオン系グロー文字(text-shadow で primary の発光を再現) 4) レベル毎のブロック欠けパターン(単調さの回避、視覚的リズム)。

## [DERIVE] Audio tone
高彩度/発光 mood に合わせ、square 波の短音("ping")を中心とした明るく硬質な音色。壁反射=440Hz、パドル反射=660Hz、ブロック破壊=990Hz から行ごとに下降(視覚の高さと音高を対応)、ローンチ=880Hz、ミス=180Hz(低音で明確に区別)。

## [DERIVE] Juice direction
ネオン系として中程度に誇張。ブロック破壊時のパーティクルバースト + HUD スコア即時更新。hitstop/shake は未実装(既存ロジックのまま、遡及適用では追加しない)。パドル端に当てるほど反射角が鋭くなる操作フィードバックが主なジュース。
