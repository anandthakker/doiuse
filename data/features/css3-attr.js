/**
 * CSS3 attr() function for all properties
 * While `attr()` is supported for effectively all browsers for the `content` property, CSS Values and Units Level 5 adds the ability to use `attr()` on **any** CSS property, and to use it for non-string values (e.g. numbers, colors).
 * @see https://caniuse.com/css3-attr
 */

/**
 * @type {import('../features').Feature}
 */
export default (rule) => {
  if (rule.type !== 'decl') return false;
  if (rule.prop === 'content') {
    return false;
  }

  return rule.toString().includes('attr(');
};
