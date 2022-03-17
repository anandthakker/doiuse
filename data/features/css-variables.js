/**
 * @param {import('postcss').ChildNode} rule
 * @return {boolean}
 */
export default (rule) => {
  if (rule.type !== 'decl') return false;
  return (rule.prop.startsWith('--') || rule.value.includes('var('));
};
