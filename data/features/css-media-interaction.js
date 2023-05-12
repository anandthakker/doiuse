/**
 * Allows a media query to be set based on the presence and accuracy of the user's pointing device, and whether they have the ability to hover over elements on the page. This includes the `pointer`, `any-pointer`, `hover`, and `any-hover` media features.
 * @see https://caniuse.com/css-media-interaction
 */

import { checkAtRule } from '../../utils/util.js';

/**
 * @type {import('../features').Feature}
 */
export default checkAtRule('media', [
  'pointer',
  'any-pointer',
  'hover',
  'any-hover',
]);
