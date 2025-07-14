/**
 * Converts a hex color string ('abc' or 'aabbcc') to an RGB triplet
 * @param {string} hex - Hex color string
 * @returns {[number, number, number] | null} RGB triplet or null if invalid
 */
function hexToRGB(hex) {
  if (typeof hex !== 'string') return null;
  if (/^[0-9a-fA-F]{3}$/.test(hex)) {
    hex = hex.split('').map(ch => ch + ch).join('');
  }
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return null;
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return [r, g, b];
}

/**
 * Returns a formatted ANSI-colored string.
 *
 * @param {string} text - The text to colorize
 * @param {Object} [options]
 * @param {string} [options.text] - Foreground hex color (e.g. 'ff00ff')
 * @param {string} [options.background] - Background hex color
 * @param {boolean} [options.bold=false] - Whether to apply bold
 * @param {boolean} [options.underline=false] - Whether to apply underline
 * @returns {string} ANSI string for use with ns.tprint, ns.print, etc.
 */
export function coloredString(text, options = {}) {
  const codes = [];

  if (options.bold) codes.push('1');
  if (options.underline) codes.push('4');

  const fg = hexToRGB(options.text);
  if (fg) codes.push(`38;2;${fg[0]};${fg[1]};${fg[2]}`);

  const bg = hexToRGB(options.background);
  if (bg) codes.push(`48;2;${bg[0]};${bg[1]};${bg[2]}`);

  const prefix = codes.length > 0 ? `\u001b[${codes.join(';')}m` : '';
  const reset = '\u001b[0m';

  return `${prefix}${text}${reset}`;
}