/**
 * Allows styling specifically for the first line of text using the `::first-line` pseudo-element. Note that only a limited set of properties can be applied.
 *
 * See: https://caniuse.com/css-first-line
 */

import { checkSelector } from '../../utils/util.js';

/**
 * @type {import('../features').Feature}
 */
export default checkSelector(':first-line');
