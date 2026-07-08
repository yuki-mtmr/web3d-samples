# Theme Sheet: B26 もぐらポップ

## [FIXED] Palette (brief.json より転記・変更不可)
- primary: #ffd24a
- accent: #8affda
- background: #241a10
- danger: #ff6a20

## [FIXED] Mood keywords
- 縁日
- 高彩度

## [FIXED] Prohibitions(実装中は毎回この一覧を再確認すること)
- 外部テクスチャ画像の使用
- 土台や穴の彩度を落として地味にする配色
- 冷色系ネオンへの逸脱

## [DERIVE] Camera
固定俯瞰の PerspectiveCamera(fov 44)。position (0, 8.2, 7.2) から (0, 0, -0.3) を注視し、3x3 の穴グリッド全体を見下ろす。追従なし(静的画角、縁日の屋台を正面から見下ろす構図)。

## [DERIVE] Lighting
AmbientLight(0xffe8c8, 0.75) の暖色環境光 + DirectionalLight(0xfff2d8, 1.3, position (4,10,5)) の上方キーライト。影は無効(renderPreset.shadows=false、9 穴の平面ステージで影の必要性が低い)。金モグラのみ emissive(0xaa7700, intensity 0.5)で他個体と識別。爆弾の火花は emissive(0xff6a20, intensity 2)で danger 色を体現。

## [DERIVE] Material
T1(CanvasTexture)方式: 土台(ground)は procedural CanvasTexture(緑地に斑点ノイズを乗せた芝生風)。モグラ本体・穴の縁・爆弾の導火線と火花は MeshStandardMaterial/MeshBasicMaterial の primitive 色のみ(CapsuleGeometry/TorusGeometry/SphereGeometry/CylinderGeometry)。glTF プロップは使用しない。

## [DERIVE] Background decoration
1) 3x3 グリッドの穴(TorusGeometry の土の縁 + 黒い CircleGeometry の穴底)9 箇所、2) 芝生 CanvasTexture の土台プレーン、3) モグラの鼻・目の造作(通常/金モグラ)と爆弾の導火線+火花(bomb モグラ)による個体差装飾。

## [DERIVE] Audio tone
高彩度(縁日の賑やかさ)に合わせ、square 波中心の明るい短音: 通常ヒットは 320→140Hz の下降パーカッシブ音(bonk)、金モグラは 988/1319Hz の 2 音コイン音(coin)、爆弾は lowpass 済みノイズバーストの破裂音(bomb)。いずれも Web Audio API を直叩きした短尺エンベロープ(lib/audio.mjs 未使用、既存実装のまま)。

## [DERIVE] Juice direction
高彩度・縁日らしい軽快な誇張: rising は ease-out cubic で 0.16s の飛び出し、hit はスケール圧縮(scale.y を最大 0.8 潰す + scale.x/z を 1.25 倍に広げながら沈む)0.22s のパンチ演出。爆弾ヒットはコンボリセット + 「💥 爆弾！-200」テキストで視覚フィードバック。シェイクやパーティクルは未実装(ミニマルな和風演出として控えめに維持)。
