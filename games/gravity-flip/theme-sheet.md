# Theme Sheet: B03 Gravity Flip

## [FIXED] Palette (brief.json より転記・変更不可)
- primary: #35d0ff
- accent: #d8f4ff
- background: #05070f
- danger: #ff3d81

## [FIXED] Mood keywords
- ワイヤーフレーム
- 高彩度
- 発光

## [FIXED] Prohibitions(実装中は毎回この一覧を再確認すること)
- 外部テクスチャ画像の使用
- 障害物が背景ワイヤーフレームに埋没する配色
- bloom 不在での emissive 多用

## [DERIVE] Camera
横スクロール固定カメラ。反転時に ±2° のロールを 0.2s だけ入れ、上下反転の体感を強調。

## [DERIVE] Lighting
単一 PointLight + emissive。ワイヤーフレーム面(床/天井)はライト非依存の MeshBasic。全体は暗め、被写体をエッジ発光で浮かせる。

## [DERIVE] Material
T0: プレイヤー=八面体(シアン emissive)、柱=InstancedMesh ボックス(ピンク emissive)。背景ワイヤーフレームは低コントラスト(#14202e 系)に落とし、柱の視認性を確保(prohibitions 対応)。

## [DERIVE] Background decoration
1) 奥行き方向のグリッド消失点 2) スキャンライン風の薄い横線オーバーレイ 3) 反転時のグリッチ風フラッシュ(1 フレーム)。

## [DERIVE] Audio tone
高域中心の短い電子音。反転=rise、通過スコア=ping 小、衝突=crash。audio.mjs プリセット既定音量。

## [DERIVE] Juice direction
誇張気味。反転時に shake 0.3 + 残像、衝突時 hitstop 0.12 + burst 大。レトロ電子演出に寄せる。
