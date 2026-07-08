# Theme Sheet: B25 Meteor Defense

## [FIXED] Palette (brief.json より転記・変更不可)
- primary: #9fd8ff
- accent: #ffb35a
- background: #05060f
- danger: #ff5a20

## [FIXED] Mood keywords
- 宇宙
- 発光
- 星屑

## [FIXED] Prohibitions(実装中は毎回この一覧を再確認すること)
- 外部テクスチャ画像の使用
- 流星着弾時の爆発エフェクト省略
- 暖色(炎)と寒色(迎撃)のコントラストを崩す配色

## [DERIVE] Camera
固定 PerspectiveCamera(fov 55, position (0,6,26), lookAt (0,7,0))。街並みと降り注ぐ流星を横から見下ろす据え置き視点。追従・パン無し(クリック照準に専念させるため画角は動かさない)。

## [DERIVE] Lighting
AmbientLight(0x304060, 1.4) で寒色の環境光を全体に敷き、DirectionalLight「月光」(0x8899cc, 0.6, position (-10,20,5))で右奥からの寒色ハイライトを追加。shadow は無効(shadows=false)。流星(emissive 0xff5a20)・建物窓(emissiveMap 暖色)・迎撃弾/爆風の加算スプライト(fireGlow 暖色 / blueGlow 寒色)が主な発光源で、暖色(炎・被弾)と寒色(迎撃・月光)のコントラストを担う。

## [DERIVE] Material
- 建物: BoxGeometry + MeshStandardMaterial(CanvasTexture 手続き窓テクスチャを map/emissiveMap に使用、color 0x3a4a6e、roughness 0.85)— T1 CanvasTexture 方式
- 流星: DodecahedronGeometry + MeshStandardMaterial(color 0x8a5a3a, emissive 0xff5a20, roughness 0.7)— T0 primitive+emissive
- 地面: PlaneGeometry + MeshStandardMaterial(color 0x0a0e1c, roughness 1)
- 迎撃弾/爆風/流星グロー: Sprite + SpriteMaterial(CanvasTexture 製グラデーション glowTexture、AdditiveBlending)— T1 CanvasTexture 方式
- 星屑: Points + PointsMaterial(color 0xcdd8ff, size 0.14)

## [DERIVE] Background decoration
1. 街並み: 高さ・位置をランダム化した 7 棟のビル(窓 CanvasTexture で明滅表現)
2. 星屑パーティクル: 300 点の Points を奥の空に配置
3. Fog(0x05060f, 40, 90): 奥行きの霞み演出
4. 爆風/迎撃弾のグロースプライト: 戦闘の余韻を可視化する装飾兼エフェクト

## [DERIVE] Audio tone
WebAudio 手続き生成のノイズ爆発音(boom: ローパス済みホワイトノイズ、低域中心の減衰音)と、迎撃弾発射音(launchSfx: sawtooth 200→900Hz の上昇スイープ)。宇宙/発光 mood に合わせ、爆発は重厚な低域減衰、発射は高域へ抜ける明るいスイープで対比させている。

## [DERIVE] Juice direction
被弾建物は emissiveIntensity を維持したまま非表示化(即時消滅、控えめ)。爆風は加算ブレンドのスプライトスケールを 0.5→maxR*2.4 まで拡大しつつ opacity を減衰させる標準的な glow juice(mood「発光」に合わせた中程度の派手さ、hitstop/shake は不使用でテンポ重視)。
