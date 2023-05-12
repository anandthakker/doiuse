/**
 * CSS :read-only and :read-write selectors
 * :read-only and :read-write pseudo-classes to match elements which are considered user-alterable
 * @see https://caniuse.com/css-read-only-write
 */

import { checkSelector } from '../../utils/util.js';

/**
 * @type {import('../features').Feature}
 */
export default checkSelector([':read-only', ':read-write']);
