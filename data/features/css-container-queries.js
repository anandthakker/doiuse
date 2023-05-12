/**
 * Size queries in Container Queries provide a way to query the size of a container, and conditionally apply CSS to the content of that container.
 *
 * See: https://caniuse.com/css-container-queries
 */

import { checkAtRule } from '../../utils/util.js';

/**
 * @type {import('../features').Feature}
 */
export default checkAtRule('container');
