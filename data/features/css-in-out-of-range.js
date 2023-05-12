/**
 * If a temporal or number `<input>` has `max` and/or `min` attributes, then `:in-range` matches when the value is within the specified range and `:out-of-range` matches when the value is outside the specified range. If there are no range constraints, then neither pseudo-class matches.
 * @see https://caniuse.com/css-in-out-of-range
 */

import { checkSelector } from '../../utils/util.js';

/**
 * @type {import('../features').Feature}
 */
export default checkSelector([
  ':in-range',
  ':out-of-range',
]);
