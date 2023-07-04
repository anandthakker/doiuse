/**
 * given a kebab-case string, returns a camelCase string
 * @param {string} kebab the kebab-case string
 * @return {string} the camelCase string
 */
export function kebabToCamel(kebab) {
  return kebab.replaceAll(/-([a-z])/g, (match, letter) => letter.toUpperCase());
}
