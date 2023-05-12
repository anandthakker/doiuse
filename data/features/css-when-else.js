/**
 * CSS @when / @else conditional rules
 * Syntax allowing CSS conditions (like media and support queries) to be written more simply, as well as making it possibly to write mutually exclusive rules using `@else` statements.
 * @see https://caniuse.com/css-when-else
 */

import { checkAtRule } from '../../utils/util.js';

/**
 * @type {import('../features').Feature}
 */
export default checkAtRule(['when', 'else']);
