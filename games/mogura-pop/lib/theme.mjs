// brief.json の palette をゲーム側の定数として読み込む (docs/contracts/brief.schema.json)。
// three.js の Color 変換は呼び出し側(index.html)で行い、lib/ は three 非依存を維持する。
// fork 時: fetch('./brief.json') → loadTheme(brief) → material.color.set(theme.primary) 等。
const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/;
const ROLES = ['primary', 'accent', 'background', 'danger'];

export function loadTheme(brief) {
  const palette = brief?.palette;
  if (palette === null || typeof palette !== 'object') {
    throw new Error('loadTheme: brief.palette object is required');
  }
  return Object.freeze(
    Object.fromEntries(
      ROLES.map((role) => {
        const value = palette[role];
        if (typeof value !== 'string' || !HEX_PATTERN.test(value)) {
          throw new Error(`loadTheme: palette.${role} must be a #rrggbb hex string, got ${JSON.stringify(value)}`);
        }
        return [role, value];
      })
    )
  );
}
