# Theme Sheet: B08 Neon Volley

## [FIXED] Palette (brief.json より転記・変更不可)
- primary: #46e6b0
- accent: #e8ecf8
- background: #06080f
- danger: #ff5470

## [FIXED] Mood keywords
- 高彩度
- 発光
- 硬質幾何

## [FIXED] Prohibitions(実装中は毎回この一覧を再確認すること)
- テクスチャ画像の使用
- bloom 不在での emissive 多用
- 低コントラストな HUD

## [DERIVE] Camera
横視点固定。ラリーの往復が一望できる引きの画角、shake は控えめ。

## [DERIVE] Lighting
Ambient 弱 + emissive 主体。壁・パドル・ボールをエッジ発光させ、背景は沈める。

## [DERIVE] Material
T0: パドル/壁=Box + emissive、ボール=Sphere + 高 emissive。bloom 導入が今後の課題(N9 減点中)。

## [DERIVE] Background decoration
1) 奥の薄いグリッド 2) スコアラインの発光帯 3) ラリー数に応じた背景色相の微変化。

## [DERIVE] Audio tone
高域の短い電子音。ヒット=ping、加速=rise、失点=fall。audio.mjs プリセット既定。

## [DERIVE] Juice direction
中程度。ヒット時 hitstop 0.05 + 小 burst、失点時 shake 0.4。
