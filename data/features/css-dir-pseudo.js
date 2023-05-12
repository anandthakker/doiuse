/**
 * Matches elements based on their directionality. `:dir(ltr)` matches elements which are Left-to-Right. `:dir(rtl)` matches elements which are Right-to-Left.
 *
 * See: https://caniuse.com/css-dir-pseudo
 */

import { checkSelector } from '../../utils/util.js';

/**
 * @type {import('../features').Feature}
 */
export default checkSelector(':dir(');
