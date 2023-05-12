/**
 * The `:default` pseudo-class matches checkboxes and radio buttons which are checked by default, `<option>`s with the `selected` attribute, and the default submit button (if any) of a form.
 *
 * See: https://caniuse.com/css-default-pseudo
 */

import { checkSelector } from '../../utils/util.js';

/**
 * @type {import('../features').Feature}
 */
export default checkSelector(':default');
