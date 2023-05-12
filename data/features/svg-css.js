/**
 * SVG in CSS backgrounds
 * Method of using SVG images as CSS backgrounds
 * @see https://caniuse.com/svg-css
 */

/**
 * @type {import('../features').Feature}
 */
export default (rule) => {
  if (rule.type !== 'decl') return false;
  if (/url\([\S\s]*svg/g.test(
    rule.toString(),
  )) {
    return true;
  }

  return false;
};
