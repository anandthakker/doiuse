/**
 * An explicit, non-whitespace spelling of the descendant combinator. `A >> B` is equivalent to `A B`.
 *
 * See: https://caniuse.com/css-descendant-gtgt
 */

import { checkSelector } from '../../utils/util.js';

/**
 * @type {import('../features').Feature}
 */
export default checkSelector('>>');
