/**
 * The `:focus-visible` pseudo-class applies while an element matches the `:focus` pseudo-class, and the UA determines via heuristics that the focus should be specially indicated on the element (typically via a “focus ring”).
 *
 * See: https://caniuse.com/css-focus-visible
 */

import { checkSelector } from '../../utils/util.js';

/**
 * @type {import('../features').Feature}
 */
export default checkSelector(':focus-visible');
