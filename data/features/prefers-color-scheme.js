/**
 * prefers-color-scheme media query
 * Media query to detect if the user has set their system to use a light or dark color theme.
 * @see https://caniuse.com/prefers-color-scheme
 */

import { checkAtRule } from '../../utils/util.js';

/**
 * @type {import('../features').Feature}
 */
export default checkAtRule('media', 'prefers-color-scheme');
