/**
 * #rrggbbaa hex color notation
 * The CSS Color Module Level 4 defines new 4 & 8 character hex notation for color to include the opacity level.
 * @see https://caniuse.com/css-rrggbbaa
 */

/**
 * @type {import('../features').Feature}
 */
export default {
  '': [
    /#[\da-f]{8}/i,
    /#[\da-f]{4}(\W|$)/i,
  ],
};
