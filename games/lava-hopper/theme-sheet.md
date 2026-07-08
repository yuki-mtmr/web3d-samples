# Theme Sheet: B05 Lava Hopper

## [FIXED] Palette (brief.json より転記・変更不可)
- primary: #ffb347
- accent: #35e08a
- background: #170b08
- danger: #ff3b30

## [FIXED] Mood keywords
- 溶岩
- 熱波陽炎
- 発光

## [FIXED] Prohibitions(実装中は毎回この一覧を再確認すること)
- 外部テクスチャ画像の使用
- 寒色背景(青系グラデーションの流用禁止)
- bloom 不在での emissive 多用

## [DERIVE] Camera
見下ろし寄りの追従カメラ(lerp 追従)。足場列の先読みができる俯角を維持し、ジャンプ中も水平は固定。

## [DERIVE] Lighting
Hemisphere(暖色)+ Directional 弱 + 溶岩面直上の PointLight(#ff5a1f 系)。溶岩の照り返しをボトムライトとして表現。shadow なし。

## [DERIVE] Material
T1 候補: 溶岩面は単色 emissive 平面 → CanvasTexture ノイズで温度斑を表現(M7 A/B 実測後に解禁)。足場=八角柱 MeshStandard(残時間で暖色→危険色)、プレイヤー=カプセル。

## [DERIVE] Background decoration
1) 遠景の黒い岩塊シルエット列 2) 溶岩面から立ち上る火の粉パーティクル(上昇+減衰) 3) 熱波の陽炎(頂点揺らぎ)。

## [DERIVE] Audio tone
低域中心・減衰長め。ジャンプ=rise、着地=click 低め、沈没=fall、間欠泉=crash。audio.mjs プリセットの音量を控えめに統一。

## [DERIVE] Juice direction
中程度。着地時の squash + 小 shake、沈没時に hitstop 0.1 + 火の粉 burst。ミニマルにせず「熱」の重さを出す。
