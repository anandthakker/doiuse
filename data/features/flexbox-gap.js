/**
 * gap property for Flexbox
 * `gap` for flexbox containers to create gaps/gutters between flex items
 * @see https://caniuse.com/flexbox-gap
 */

/**
 * @type {import('../features').Feature}
 */
export default (rule) => {
  if (/display:\s(inline-)?flex/.test(rule.toString())
    && rule.toString().includes('gap:')
  ) {
    return true;
  }

  return false;
};
