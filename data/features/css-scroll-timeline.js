/**
 * CSS @scroll-timeline
 * CSS property that allows animations to be driven by a container's scroll position
 * @see https://caniuse.com/css-scroll-timeline
 */

import { checkAtRule } from '../../utils/util.js';

const checkAt = checkAtRule('scroll-timeline');

/**
 * @type {import('../features').Feature}
 */
export default (node) => {
  // check for @scroll-timeline
  if (checkAt(node)) {
    return true;
  }

  // check for animation-timeline
  if (node.type !== 'decl') return false;
  if (node.prop.startsWith('animation-timeline')) {
    return true;
  }

  return false;
};
