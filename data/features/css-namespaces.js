/**
 * Using the `@namespace` at-rule, elements of other namespaces (e.g. SVG) can be targeted using the pipe (`|`) selector.
 * @see https://caniuse.com/css-namespaces
 */

import { checkAtRule } from '../../utils/util.js';

/**
 * @type {import('../features').Feature}
 */
export default checkAtRule('namespace');
