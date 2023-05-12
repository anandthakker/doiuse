import { list } from 'postcss';

/**
 * @param {import('postcss').ChildNode} rule
 * @return {boolean}
 */
export default (rule) => {
  if (rule.type !== 'decl') return false;
  if (rule.prop !== 'background-position') return false;
  return list.space(rule.value).length > 2;
};
