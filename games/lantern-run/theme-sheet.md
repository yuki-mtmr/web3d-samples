# Theme Sheet: B23 宵闇参道 Lantern Run

## [FIXED] Palette (brief.json より転記・変更不可)
- primary: #c22a18
- accent: #ff9a4d
- background: #0a0716
- danger: #e0432d

## [FIXED] Mood keywords
- 和風
- 提灯灯り
- 発光

## [FIXED] Prohibitions(実装中は毎回この一覧を再確認すること)
- 外部テクスチャ画像の使用
- 鳥居ゲートが背景に埋没する配色
- 寒色ネオンへの逸脱

## [DERIVE] Camera
固定 FOV70 の一人称追従カメラ(PerspectiveCamera, position z=6, 参道奥へ向く)。カメラ自体は動かず、ゲート群が -z 方向から手前へ流れてくる構図とプレイヤー(火の玉)の左右上下フロートで速度感を出す。

## [DERIVE] Lighting
AmbientLight(0x352a50, 1.2) で宵闇の紫がかった環境光を全体に敷き、PointLight(0xff9a4d, 30, 30, 1.7) を火の玉に追従させて橙の暖色光源とする。Fog(0x0d0820, 18, 70) で奥行きを霧に沈める。shadow は使わない(renderPreset.shadows=false と一致)。

## [DERIVE] Material
T1(CanvasTexture 中心)。火の玉のグロー・尾のパーティクルは glowTexture() による手続き生成の放射グラデーション CanvasTexture(SRGBColorSpace)。鳥居ゲートの板・縁光バーは MeshStandardMaterial + emissive(primary/accent 系)、装飾提灯・星は Sphere/Points プリミティブ + emissive/色指定のみで外部テクスチャ画像は使用しない。

## [DERIVE] Background decoration
1) 側道に並ぶ提灯(sideLanterns, 40 個, emissive 橙球)、2) 奥行きの星屑パーティクル(Points, 250 個, 青白)、3) 鳥居ゲート自体の縁光バー(枠に沿う発光スティック)、4) 火の玉の残像トレイル(Points, 22 点)。以上 4 種で環境装飾ゼロを回避済み。

## [DERIVE] Audio tone
lib/audio.mjs は未使用。ゲーム内蔵の beep() ヘルパー(sine/triangle/sawtooth の単純オシレータ)で、通過成功は triangle 高域(740Hz 前後)の短い明るい音、ゲームオーバーは sawtooth 低域(120Hz)の減衰音を鳴らす。mood「提灯灯り・発光」に合わせ高域中心の軽い成功音を基調とする。

## [DERIVE] Juice direction
派手すぎない控えめな juice。火の玉のスケール微振動(sin 揺らぎ)、通過音のピッチランダム化、ゲームオーバー時の低音 beep のみで、hitstop・カメラシェイク・パーティクルバーストは未実装。和風の落ち着いた mood に合わせ最小限の演出に留めている。
