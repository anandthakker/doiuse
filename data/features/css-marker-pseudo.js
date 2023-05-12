/**
 * The `::marker` pseudo-element allows list item markers to be styled or have their content value customized.
 * @see https://caniuse.com/css-marker-pseudo
 */

import { checkSelector } from '../../utils/util.js';

/**
 * @type {import('../features').Feature}
 */
export default checkSelector(':marker');
