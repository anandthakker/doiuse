/**
 * gap property for Flexbox
 * `gap` for flexbox containers to create gaps/gutters between flex items
 * @see https://caniuse.com/flexbox-gap
 */

/**
 * @type {import('../features').Feature}
 */
export default (rule) => {
  if (rule.type !== 'rule') {
    return false;
  }

  let isFlexbox = false;
  let isGap = false;

  return rule.some((decl) => {
    if (decl.type !== 'decl') {
      return false;
    }

    isFlexbox ||= decl.prop === 'display' && (decl.value === 'flex' || decl.value === 'inline-flex');
    isGap ||= decl.prop === 'gap';

    return isFlexbox && isGap;
  });
};
