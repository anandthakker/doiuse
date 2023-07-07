import { agents } from 'caniuse-lite';

/** @typedef {RegExp|string|((value:string) => boolean)} FeatureCheck */

/**
 * @param {string} browserKey
 * @param {string[]} [versions]
 * @return {string}
 */
export function formatBrowserName(browserKey, versions) {
  const entry = agents[browserKey];
  const browserName = entry ? entry.browser : null;
  if (!versions) {
    return browserName || '';
  }
  return (`${browserName} (${versions.join(',')})`);
}

/**
 *
 * @param {FeatureCheck|FeatureCheck[]} check
 * @param {?string|undefined} candidate
 */
export function performFeatureCheck(check, candidate) {
  if (check == null || candidate == null) return false;
  if (check instanceof RegExp) {
    return check.test(candidate);
  }
  switch (typeof check) {
    case 'string':
      return candidate.includes(check);
    case 'function':
      return check(candidate);
    case 'boolean':
      return check;
    case 'object':
      if (Array.isArray(check)) {
        return check.some((c) => performFeatureCheck(c, candidate));
      }
      // Fallthrough
    default:
      console.error(check);
      throw new TypeError(`Unexpected feature check: ${check}`);
  }
}

/**
 * @param {FeatureCheck|FeatureCheck[]} selector
 * @return {(rule:import('postcss').ChildNode) => boolean}
 */
export function checkSelector(selector) {
  return (rule) => rule.type === 'rule'
   && performFeatureCheck(selector, rule.selector);
}

/**
 * @param {FeatureCheck|FeatureCheck[]} [name]
 * @param {FeatureCheck|FeatureCheck[]} [parameters]
 * @return {(rule:import('postcss').ChildNode) => boolean}
 */
export function checkAtRule(name, parameters) {
  return (rule) => rule.type === 'atrule'
    && performFeatureCheck(name, rule.name)
    && (!parameters || performFeatureCheck(parameters, rule.params));
}

/**
 * @see https://drafts.csswg.org/css-values/#lengths
 * @see https://drafts.csswg.org/css-values/#number-value
 * @param {string[]} units
 * @return {(rule:import('postcss').ChildNode) => boolean}
 */
export function checkCSSLengthUnits(...units) {
  const regexp = new RegExp(`(\\+-)?[\\d.]*\\.?\\d+(e(\\+-)?\\d+)?(${units.join('|')})`, 'i');
  return (rule) => (
    (rule.type === 'decl') ? performFeatureCheck(regexp, rule.value)
      : ((rule.type === 'atrule') ? performFeatureCheck(regexp, rule.params)
        : false));
}
