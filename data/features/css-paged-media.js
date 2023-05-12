/**
 * CSS at-rule (`@page`) to define page-specific rules when printing web pages, such as margin per page and page dimensions.
 * @see https://caniuse.com/css-paged-media
 */

import { checkAtRule } from '../../utils/util.js';

/**
 * @type {import('../features').Feature}
 */
export default checkAtRule('page');
