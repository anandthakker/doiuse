/**
 * text-emphasis styling
 * Method of using small symbols next to each glyph to emphasize a run of text, commonly used in East Asian languages. The `text-emphasis` shorthand, and its `text-emphasis-style` and `text-emphasis-color` longhands, can be used to apply marks to the text. The `text-emphasis-position` property, which inherits separately, allows setting the emphasis marks' position with respect to the text.
 * @see https://caniuse.com/text-emphasis
 */

/**
 * @type {import('../features').Feature}
 */
export default {
  'text-emphasis': true,
  'text-emphasis-style': true,
  'text-emphasis-color': true,
  'text-emphasis-position': true,
};
