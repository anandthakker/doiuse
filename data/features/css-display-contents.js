/**
 * `display: contents` causes an element's children to appear as if they were direct children of the element's parent, ignoring the element itself. This can be useful when a wrapper element should be ignored when using CSS grid or similar layout techniques.
 *
 * See: https://caniuse.com/css-display-contents
 */

/**
 * @type {import('../features').Feature}
 */
export default {
  'display': 'contents',
};
