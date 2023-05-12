/**
 * The `:optional` pseudo-class matches form inputs (`<input>`, `<textarea>`, `<select>`) which are not `:required`.
 * @see https://caniuse.com/css-optional-pseudo
 */

import { checkSelector } from '../../utils/util.js';

/**
 * @type {import('../features').Feature}
 */
export default checkSelector(':optional');
