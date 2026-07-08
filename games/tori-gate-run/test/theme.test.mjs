import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadTheme } from '../lib/theme.mjs';

const palette = {
  primary: '#ff5a1f',
  accent: '#ffcf4d',
  background: '#170604',
  danger: '#ff2d00',
};

test('loadTheme returns the four validated palette roles', () => {
  const theme = loadTheme({ palette });
  assert.deepEqual(theme, {
    primary: '#ff5a1f',
    accent: '#ffcf4d',
    background: '#170604',
    danger: '#ff2d00',
  });
});

test('invalid hex string throws', () => {
  assert.throws(
    () => loadTheme({ palette: { ...palette, primary: 'red' } }),
    /primary/
  );
  assert.throws(
    () => loadTheme({ palette: { ...palette, accent: '#fff' } }),
    /accent/
  );
});

test('missing palette role throws', () => {
  const { danger, ...partial } = palette;
  assert.throws(() => loadTheme({ palette: partial }), /danger/);
});

test('missing palette object throws', () => {
  assert.throws(() => loadTheme({}), /palette/);
  assert.throws(() => loadTheme(null), /palette/);
});

test('uppercase hex is accepted (schema parity)', () => {
  const theme = loadTheme({ palette: { ...palette, primary: '#FF5A1F' } });
  assert.equal(theme.primary, '#FF5A1F');
});
