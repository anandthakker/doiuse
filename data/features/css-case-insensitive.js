/**
 * Including an `i` before the `]` in a CSS attribute selector causes the attribute value to be matched in an ASCII-case-insensitive manner. For example, `[b="xyz" i]` would match both `<a b="xyz">` and `<a b="XYZ">`.
 *
 * See: https://caniuse.com/css-case-insensitive
 */

/**
 * @type {import('../features').Feature}
 */
export default (rule) => {
  if (rule.type !== 'rule') { return false; }
  if (/\[.*i]/.test(rule.selector)) { return true; }
  return false;
};
