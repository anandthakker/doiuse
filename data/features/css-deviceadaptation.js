/**
 * Method of overriding the size of viewport in web page using the `@viewport` rule, replacing Apple's own popular `<meta>` viewport implementation. Includes the `extend-to-zoom` width value.
 *
 * See: https://caniuse.com/css-deviceadaptation
 */

import { checkAtRule } from '../../utils/util.js';

/**
 * @type {import('../features').Feature}
 */
export default checkAtRule('viewport');
