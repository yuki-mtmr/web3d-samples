# Theme Sheet: B22 金魚すくい

## [FIXED] Palette (brief.json より転記・変更不可)
- primary: #d83a2a
- accent: #e8b04b
- background: #10222e
- danger: #ff3a3a

## [FIXED] Mood keywords
- 和風
- 縁日
- 水中光条

## [FIXED] Prohibitions(実装中は毎回この一覧を再確認すること)
- 外部テクスチャ画像の使用
- ポイの紙が水と同化する低コントラスト配色
- 寒色ネオンへの逸脱

## [DERIVE] Camera
固定俯瞰(PerspectiveCamera fov46)。position(0, 9.5, 5.2) から lookAt(0, 0, -0.4) で、たらい(POOL_R=5.2)全体を見下ろす縁日の屋台視点。追従なし・カメラ操作なし(ポインタはポイのみ動かす)。

## [DERIVE] Lighting
AmbientLight(0xbfd8e8, 0.9) の寒色寄り環境光で水中の陰影を柔らかくし、DirectionalLight(0xfff2d8, 1.5) を position(3, 10, 4) の暖色「日差し」として重ねる二灯構成。shadow 無効(renderPreset.shadows=false)。brief の「アンビエント寒色 + 暖色ディレクショナル」はこの実装をそのまま指す。

## [DERIVE] Material
T1(CanvasTexture)。たらいの底面のみ CanvasTexture(256x256、水紋の弧線を procedural に描画)を roughness 0.9 の MeshStandardMaterial に適用。他は全て primitive + MeshStandardMaterial の単色(縁=トーラス、水面=半透明サークル、金魚=球+コーン、ポイ=トーラス+サークル+シリンダー)。外部画像テクスチャは不使用(prohibitions 1 と一致)。

## [DERIVE] Background decoration
1) たらいの縁(TorusGeometry, 青磁色 0x3a6ea8) 2) 底の水紋 CanvasTexture(同心円の弧を14本ランダム配置) 3) 半透明の水面サークル(0x8fd0e8, opacity 0.38) 4) すくうたびに広がる波紋リング(ripple: 通常/大 の2段階、寿命付きで自動消滅)。舞台装飾はこの4種で構成。

## [DERIVE] Audio tone
lib/audio.mjs のプリセットは未使用(独自 WebAudio 実装済み)。plop(sine, 押し込み/空振りで低めの摩擦音)・chime(triangle 3和音の高域、すくい成功音)・ripSound(bandpass ノイズ、紙が破れる音)の3系統で、縁日の軽妙な音色に寄せている。

## [DERIVE] Juice direction
hitstop なし。すくわれた金魚は放物線ジャンプ(f.jump: y = -0.3 + 6t - 9t^2)しながら回転・縮小して消える演出、波紋(ripple)の拡大フェードが主な shake 代替。ミニマル寄りの控えめな誇張度(mood の「和風」「縁日」に合わせ派手な粒子演出は使わない)。
