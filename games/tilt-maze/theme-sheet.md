# Theme Sheet: B30 Tilt Maze — 玉ころがし

## [FIXED] Palette (brief.json より転記・変更不可)
- primary: #e8b04b
- accent: #4ade80
- background: #1a1410
- danger: #5e4023

## [FIXED] Mood keywords
- 低彩度
- 侘び寂び

## [FIXED] Prohibitions(実装中は毎回この一覧を再確認すること)
- 外部テクスチャ画像の使用
- ゴールパッドの発光緑を弱めて視認性を落とす配色
- 暖色木目のトーンを寒色系へ転換する配色

## [DERIVE] Camera
固定俯瞰の PerspectiveCamera(fov 42)。position (0, 14.5, 7.5) から (0, 0, -0.5) を注視する見下ろし構図。追従なし(盤自体がポインタ入力で傾く演出のため、カメラは静的に固定して盤の傾きだけを見せる)。

## [DERIVE] Lighting
AmbientLight(0xfff2e0, 0.55)の暖色環境光 + DirectionalLight(0xfff2d8, 1.6, position (5,12,6))の暖色キーライト。key は castShadow=true(shadow.mapSize 1024、camera 範囲 ±8)で木製盤面に落ち影を落とし、木肌・壁の質感を低彩度ながら立体的に見せる。renderPreset.shadows は false(shadow 管理は本ゲーム側で直接完結しており render-preset の遅延焼き込み対象外)。

## [DERIVE] Material
T1(primitive のみ、procedural CanvasTexture 不使用): 床(woodMat #8a6238)・壁(wallMat #5e4023)は MeshStandardMaterial の primitive 色。ゴールパッド(goalMat)は primary 系の補色として emissive #22c55e(intensity 0.9)で発光させ視認性を確保。穴(holeMat)は MeshBasicMaterial の暗色 #0a0806。玉(ball)は metalness 0.85 / roughness 0.25 の淡灰色 MeshStandardMaterial。glTF プロップは使用しない。

## [DERIVE] Background decoration
1) BoxGeometry の床(木目色)、2) BoxGeometry の壁(迷路パターン、11x11 グリッド)、3) CylinderGeometry のゴールパッド(emissive 緑)、4) CircleGeometry の穴(黒)。舞台装置は迷路構造そのものに内包される最小構成(侘び寂びの mood に沿い装飾を足さない)。

## [DERIVE] Audio tone
低彩度・侘び寂びの mood に合わせ、控えめな sine 波中心の短音: 壁衝突は 300Hz の短いパーカッシブ音(tick)、ゴール到達は 880Hz の高めの単音、全面クリアは 523/659/784/1047Hz の triangle 波アルペジオ(fanfare)、穴への落下は 500→80Hz の下降スイープ(fallSfx)。いずれも Web Audio API 直叩き(lib/audio.mjs 未使用、既存実装のまま)。

## [DERIVE] Juice direction
低彩度・侘び寂びの mood に沿い、控えめな演出のみ: 盤の傾きはポインタ位置へ 0.14 の補間で機敏に追従、壁衝突時は速度反転(-0.35倍)のみで shake やパーティクルは付けない。穴への落下は 0.5s かけて玉が沈み込みながら縮小するシンプルな演出(スケール 1→0.2、y -1.4)。派手な hitstop/shake は意図的に未実装(ミニマルな盤ゲームとしての落ち着きを優先)。
