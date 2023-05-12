/**
 * The newest versions of `:nth-child()` and `:nth-last-child()` accept an optional `of S` clause which filters the children to only those which match the selector list `S`. For example, `:nth-child(1 of .foo)` selects the first child among the children that have the `foo` class (ignoring any non-`foo` children which precede that child). Similar to `:nth-of-type`, but for arbitrary selectors instead of only type selectors.
 * @see https://caniuse.com/css-nth-child-of
 */

import { checkSelector } from '../../utils/util.js';

/**
 * @type {import('../features').Feature}
 */
export default checkSelector(
  (selector) => /:nth-(child|last-child)\(\s*\d+\s*of/.test(selector),
);
