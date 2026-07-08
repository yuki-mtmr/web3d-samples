# Theme Sheet: B29 Stack Tower

## [FIXED] Palette (brief.json より転記・変更不可)
- primary: #399ed0
- accent: #ffd24a
- background: #12141f
- danger: #ff5a3c

## [FIXED] Mood keywords
- 高彩度
- 発光
- ミニマル

## [FIXED] Prohibitions(実装中は毎回この一覧を再確認すること)
- 外部テクスチャ画像の使用
- ブロックの彩度を大きく落とす低彩度パレットへの変更
- 背景を黒潰れさせる過度な暗さへの変更

## [DERIVE] Camera
OrthographicCamera による等角気味の見下ろし視点(`setCamera(h)`)。view=11 固定画角、position (12, 12+h, 12) から原点付近を look-at し、塔の高さ h を毎フレーム `camY` でイージング追従(`camY += (targetY - camY) * 0.08`)。パースなしのミニマルな幾何が「ネオン」の硬質さと合う。

## [DERIVE] Lighting
AmbientLight(白, 0.65) + DirectionalLight(白, 1.4, position (6,14,4))。色温度は中立(0xffffff 固定、色付けなし)。Fog(0x12141f, 30, 70) が background と同色で遠景をとかし、塔だけが浮かび上がる。shadow は無効(renderPreset.shadows=false と一致)。

## [DERIVE] Material
assetTier=T1 だが本ゲームは procedural CanvasTexture を使わず、T0 相当の primitive(BoxGeometry)+ MeshStandardMaterial(roughness 0.65, emissive なし)で統一。色は `blockColor(i)` が `hsl(hue0 + i*9, 62%, 52±8%)` で段ごとに色相回転させ、高彩度のグラデーションタワーを作る(hue0 はリトライ毎にランダム — 単一の固定パレットに縛られない意図的な演出)。

## [DERIVE] Background decoration
現状の装飾は最小限(phase1 の「環境装飾ゼロ」に近い状態、ミニマル mood とは整合するが強化余地あり):
1. Fog によるグラデーション背景(装飾というより空間演出)
2. 切り落とされたブロック片(debris)が回転しながら落下していく残骸演出
3. HUD 数字(score)と最小限のオーバーレイ文言のみ、3D 空間側の小物は未実装

## [DERIVE] Audio tone
WebAudio 直接合成(`beep(freq, dur, type, vol)`)。ぴったり配置時は triangle 660Hz+(level*14) の明るい音、はみ出し切断時は square 320Hz の硬質な音、ゲームオーバー時は sawtooth 140Hz の低い音。lib/audio.mjs は未使用(独自実装) — 高彩度/ネオン mood に合わせて高域中心の短いビープ音を採用済み。

## [DERIVE] Juice direction
hitstop は未実装。shake なし。演出は色の段階的グラデーション(段ごとの hue 回転)とカメラのイージング追従のみで、ミニマル mood に沿って控えめ。debris の物理落下(重力加速 + 回転)が唯一の動的フィードバック。
