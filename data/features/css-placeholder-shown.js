/**
 * :placeholder-shown CSS pseudo-class
 * Input elements can sometimes show placeholder text as a hint to the user on what to type in. See, for example, the placeholder attribute in HTML5. The :placeholder-shown pseudo-class matches an input element that is showing such placeholder text.
 * @see https://caniuse.com/css-placeholder-shown
 */

import { checkSelector } from '../../utils/util.js';

/**
 * @type {import('../features').Feature}
 */
export default checkSelector(':placeholder-shown');
