/**
 * given a kebab-case string, returns a camelCase string
 * @param {string} str the kebab-case string
 * @return {string} the camelCase string
 */
export function kebabToCamel(str) {
  return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
}
