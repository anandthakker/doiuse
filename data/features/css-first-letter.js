/**
 * CSS pseudo-element that allows styling only the first "letter" of text within an element. Useful for implementing initial caps or drop caps styling.
 *
 * See: https://caniuse.com/css-first-letter
 */

import { checkSelector } from '../../utils/util.js';

/**
 * @type {import('../features').Feature}
 */
export default checkSelector(':first-letter');
