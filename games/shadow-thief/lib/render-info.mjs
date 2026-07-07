// __GAME__.rendererInfo() の three.js アダプタ (docs/contracts/game-hook.d.ts)。
// 契約自体は engine 非依存のため、engine 固有の info 読み出しはこの 1 ファイルに隔離する
// (将来の Babylon/Pixi 分岐時はこのファイルだけ engine 別実装を用意する)。
export function createRendererInfo(renderer) {
  if (!renderer) throw new Error('createRendererInfo: renderer is required');
  if (!renderer.info?.render) {
    throw new Error('createRendererInfo: renderer.info.render not found (three.js WebGLRenderer を渡すこと)');
  }
  return () => ({
    calls: renderer.info.render.calls,
    triangles: renderer.info.render.triangles,
  });
}
