/**
 * The `@layer` at-rule allows authors to explicitly layer their styles in the cascade, before specificity and order of appearance are considered.
 *
 * See: https://caniuse.com/css-cascade-layers
 */

import { checkAtRule } from '../../utils/util.js';

/**
 * @type {import('../features').Feature}
 */
export default checkAtRule('layer');
