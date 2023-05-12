/**
 * TTF/OTF - TrueType and OpenType font support
 * Support for the TrueType (.ttf) and OpenType (.otf) outline font formats in @font-face.
 * @see https://caniuse.com/ttf
 */

/**
 * @type {import('../features').Feature}
 */
export default (rule) => {
  const ruleText = rule.toString();

  if (ruleText.includes('@font-face') && (
    (ruleText.includes('.ttf') || ruleText.includes('.otf'))
  )) {
    return true;
  }

  return false;
};
