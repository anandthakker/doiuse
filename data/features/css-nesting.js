/**
 * CSS nesting provides the ability to nest one style rule inside another, with the selector of the child rule relative to the selector of the parent rule. Similar behavior previously required a CSS pre-processor.
 * @see https://caniuse.com/css-nesting
 */

/**
 * @type {import('../features').Feature}
 */
export default (rule) => {
  if (rule.type === 'rule' && rule.parent.type === 'rule') {
    return true;
  }

  if (rule.type === 'atrule' && rule.parent.type === 'rule') {
    return true;
  }

  return false;
};
