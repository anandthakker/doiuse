import { list } from 'postcss';

/**
 * @param {import('postcss').ChildNode} rule
 * @return {boolean}
 */
export default (rule) => {
  if (rule.type !== 'decl') return false;
  if (!/^background-?/.test(rule.prop)) return false;
  return list.comma(rule.value).length > 1;
};
