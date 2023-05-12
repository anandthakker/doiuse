/**
 * Select elements containing specific content. For example, `a:has(img)` selects all `<a>` elements that contain an `<img>` child.
 * @see https://caniuse.com/css-has
 */

import { checkSelector } from '../../utils/util.js';

/**
 * @type {import('../features').Feature}
 */
export default checkSelector(':has');
