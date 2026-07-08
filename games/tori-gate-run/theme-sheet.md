# Theme Sheet: B12 Tori Gate Run

## [FIXED] Palette (brief.json より転記・変更不可)
- primary: #c73e3a
- accent: #ffd9a0
- background: #10141f
- danger: #ff5a3c

## [FIXED] Mood keywords
- 和風
- 提灯灯り
- 発光

## [FIXED] Prohibitions(実装中は毎回この一覧を再確認すること)
- 外部テクスチャ画像の使用
- 鳥居が背景に埋没する配色
- 寒色ネオンへの逸脱

## [DERIVE] Camera
追従三人称(briefs.md 指定)。プレイヤー後方やや上から、連なる鳥居の奥行きが見える画角。カメラ揺れは被弾時のみ。

## [DERIVE] Lighting
Hemisphere(宵闇の藍 #10141f 系)+ 提灯の暖色 PointLight 1 灯 + 鳥居の朱 emissive。40s の霧イベントで fog.near を詰める。bloom 有効(提灯と鳥居の発光感)。

## [DERIVE] Material
T1: 参道の石畳を procedural-texture のノイズで表現(単色大面積のテーマ核、M7 実証パターン)。鳥居=Box 組み(朱 #c73e3a + 弱 emissive)、堀=暗色 Box、提灯=小 Box(accent #ffd9a0 emissive)。

## [DERIVE] Background decoration
1) 遠景の山影シルエット(暗色平面 2 枚) 2) 参道両脇の提灯列(InstancedMesh、暖色発光) 3) 石畳の手続き型テクスチャ 4) 霧(fog、イベントで濃度変化)。

## [DERIVE] Audio tone
和風・控えめ。レーン移動=click 低め、鳥居くぐり=ping(鈴の代わり)、イベント=rise、被弾=crash。audio.mjs プリセット。

## [DERIVE] Juice direction
控えめ〜中程度(和の静けさを優先)。くぐり成功時に小パーティクル、被弾時のみ shake 0.6 + hitstop 0.1。
