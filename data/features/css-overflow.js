/**
 * Originally a single property for controlling overflowing content in both horizontal & vertical directions, the `overflow` property is now a shorthand for `overflow-x` & `overflow-y`. The latest version of the specification also introduces the `clip` value that blocks programmatic scrolling.
 * @see https://caniuse.com/css-overflow
 */

/**
 * @type {import('../features').Feature}
 */
export default {
  'overflow': true,
  'overflow-x': true,
  'overflow-y': true,
};
