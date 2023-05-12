/**
 * Changes in DOM elements above the visible region of a scrolling box can result in the page moving while the user is in the middle of consuming the content.  By default, the value of  `overflow-anchor` is `auto`, it can mitigate this jarring user experience by keeping track of the position of an anchor node and adjusting the scroll offset accordingly
 * @see https://caniuse.com/css-overflow-anchor
 */

/**
 * @type {import('../features').Feature}
 */
export default {
  'overflow-anchor': true,
};
