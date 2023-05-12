/**
 * The `:focus-within` pseudo-class matches elements that either themselves match `:focus` or that have descendants which match `:focus`.
 *
 * See: https://caniuse.com/css-focus-within
 */

import { checkSelector } from '../../utils/util.js';

/**
 * @type {import('../features').Feature}
 */
export default checkSelector(':focus-within');
