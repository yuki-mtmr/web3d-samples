# Theme Sheet: B27 Rhythm Taps

## [FIXED] Palette (brief.json より転記・変更不可)
- primary: #8affda
- accent: #a78bfa
- background: #0c0a18
- danger: #ff7a9e

## [FIXED] Mood keywords
- 高彩度
- 発光

## [FIXED] Prohibitions(実装中は毎回この一覧を再確認すること)
- 外部テクスチャ画像の使用
- レーン/ノーツ配色が背景(#0c0a18)に埋没すること
- 高彩度発光からの低彩度トーンへの逸脱

## [DERIVE] Camera
固定 PerspectiveCamera(fov 58)。position (0, 3.4, 6.5) から (0, 0.4, -6) を注視する俯瞰気味の固定視点。レーンが奥に伸びるリズムゲーム標準構図で、追従・回転演出は無し。

## [DERIVE] Lighting
AmbientLight(色 0x554a88, intensity 1.6)のみ。レーン・ノーツ・ヒットライン・フラッシュは全て MeshBasicMaterial(自己発光相当の単色)で、陰影・shadow は使用しない。envIntensity は render-preset 側の PMREM 環境反射に限定して弱く効かせる(0.3)。

## [DERIVE] Material
T1: 全オブジェクト primitive + MeshBasicMaterial の単色塗り(procedural、テクスチャ画像不使用)。レーン=半透明 PlaneGeometry(#1a1630)、ヒットライン=白 Plane、レーン別ノーツ/フラッシュ=LANE_COLORS(#8affda/#7ab8ff/#c79aff/#ff9ad0)の BoxGeometry/PlaneGeometry。

## [DERIVE] Background decoration
1) scene.background と fog を背景色 #0c0a18 に統一した奥行きフォグ(20〜46)で消失感を演出 2) ヒットライン付近のレーン押下フラッシュ(判定時に不透明度が立ち上がり dt*3 で減衰) 3) ヒットラインのビート同期パルス(beatPhase に応じた明滅)。

## [DERIVE] Audio tone
WebAudio 手続き生成: kick(サイン波 150→48Hz 減衰)、hat(ノイズ+ハイパス6kHz)、bass(ノコギリ波+ローパス500Hz)の 3 声リズムトラック。ヒット SFX は triangle 波(PERFECT=1320Hz / GOOD=880Hz)の短い減衰音。高彩度・発光 mood に合わせ高域寄りの明るい電子音で統一。

## [DERIVE] Juice direction
誇張は控えめ・明確さ優先。judge テキスト(PERFECT/GOOD/MISS)のフラッシュ表示、レーン押下時のカラーフラッシュ、ヒットラインのビートパルスのみ。hitstop・カメラシェイクは無し(タイミングゲームは可読性を優先するため現状の控えめ演出を維持)。
