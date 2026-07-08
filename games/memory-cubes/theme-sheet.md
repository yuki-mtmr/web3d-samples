# Theme Sheet: B24 Memory Cubes

## [FIXED] Palette (brief.json より転記・変更不可)
- primary: #7ab8ff
- accent: #ffd24a
- background: #0e1220
- danger: #ff5a7a

## [FIXED] Mood keywords
- 高彩度
- 発光
- ミニマル

## [FIXED] Prohibitions(実装中は毎回この一覧を再確認すること)
- 外部テクスチャ画像の使用
- キューブ間の色相差を潰す低彩度化
- 背景を明色にして基盤とのコントラストを失う配色

## [DERIVE] Camera
固定俯瞰(briefs.md 指定)。PerspectiveCamera(fov 40)を (0, 8.5, 8.5) に据え原点注視、3x3 キューブ盤面全体を見下ろす画角。追従・揺れなし(記憶ゲームの視認安定を優先)。

## [DERIVE] Lighting
AmbientLight(#aabbee, 0.8、藍色寄りの環境光)+ DirectionalLight(白色, 1.0、右上奥から)。影は無効。正解/提示タップ時は該当キューブの `emissiveIntensity` を 0.12→最大 1.62 まで明滅させ、`position.y` を最大 0.3 浮上させて視覚フィードバックとする(コードの `flash` 減衰処理)。

## [DERIVE] Material
T1: 9 キューブは MeshStandardMaterial(色+emissive 同色、roughness 0.45)の primitive、パレットは CUBE_COLORS 9 色(#ff5a7a, #ff9a4d, #ffd24a, #4ade80, #4aa8ff, #c79aff, #ff7ab8, #8affda, #f0f0f0)。base 台座は MeshStandardMaterial(#1a2136, roughness 0.9)の単色 Box。procedural テクスチャは不使用(brief prohibitions 準拠)。

## [DERIVE] Background decoration
1) 台座(7.4x0.3x7.4 の暗色 Box、キューブ群を浮かせる基盤) 2) HUD 上のラウンド数/状態文言/ベスト記録表示(DOM オーバーレイ) 3) タイトル/ゲームオーバー時の半透明ブラー オーバーレイ(`backdrop-filter: blur(6px)`)。3D 内装飾は台座のみのミニマル構成(mood「ミニマル」に合致)。

## [DERIVE] Audio tone
Web Audio によるプロシージャル発音(音源ファイルなし)。各キューブに 1 音(C4-D5 の音階、triangle 波、0.35s 減衰)を割り当て、正誤フィードバックは音高で判別。ゲームオーバー時は sawtooth 110Hz のバズ音(0.5s 減衰)で失敗を明示。mood「高彩度」に合わせ中〜高域中心の明るい音色。

## [DERIVE] Juice direction
控えめ〜中程度(mood「ミニマル」優先)。hitstop/shake は未実装、フィードバックはキューブの emissive 明滅 + 浮上のみに絞る。過剰な演出を足さず現状の簡潔さを維持する。
