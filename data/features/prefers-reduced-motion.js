/**
 * TODO: initially implement feature
 * prefers-reduced-motion media query
 * CSS media query based on a user preference for preferring reduced motion (animation, etc).
 * @see https://caniuse.com/prefers-reduced-motion
 */

import { checkAtRule } from '../../utils/util.js';

/**
 * @type {import('../features').Feature}
 */
export default checkAtRule('media', 'prefers-reduced-motion');
