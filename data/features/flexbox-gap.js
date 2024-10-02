/**
 * gap property for Flexbox
 * `gap` for flexbox containers to create gaps/gutters between flex items
 * @see https://caniuse.com/flexbox-gap
 */

/**
 * @type {import('../features').Feature}
 */
export default (rule) => {
  if (!('some' in rule) || !rule.nodes) return false;

  let hasFlexbox = false;
  let hasGap = false;

  return rule.some((decl) => {
    if (decl.type !== 'decl') return false;

    hasFlexbox ||= decl.prop === 'display' && (decl.value === 'flex' || decl.value === 'inline-flex');
    hasGap ||= decl.prop === 'gap' || decl.prop === 'column-gap' || decl.prop === 'row-gap';

    return hasFlexbox && hasGap;
  });
};
