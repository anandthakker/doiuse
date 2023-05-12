/**
 * The `:indeterminate` pseudo-class matches indeterminate checkboxes, indeterminate `<progress>` bars, and radio buttons with no checked button in their radio button group.
 * @see https://caniuse.com/css-indeterminate-pseudo
 */

import { checkSelector } from '../../utils/util.js';

/**
 * @type {import('../features').Feature}
 */
export default checkSelector(':indeterminate');
