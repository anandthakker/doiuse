/**
 * @param {import('postcss').ChildNode} rule
 * @return {boolean}
 */
export default (rule) => {
  if (rule.type !== 'decl') return false;
  if (!rule.prop.startsWith('background')) return false;
  return rule.value.startsWith('-webkit-canvas');
};
