/**
 * CSS Relative colors
 * The CSS Relative Color syntax allows a color to be defined relative to another color using the `from` keyword and optionally `calc()` for any of the color values.
 * @see https://caniuse.com/css-relative-colors
 */

/**
 * @type {import('../features').Feature}
 */
export default (rule) => {
  if (rule.type !== 'decl') {
    return false;
  }

  const colorSpaces = ['rgb', 'rgba', 'hsl', 'hsla', 'hwb'];

  return rule.value.match(/(from|calc\()/)
  && colorSpaces.some((colorSpace) => rule.value.includes(colorSpace));
};
