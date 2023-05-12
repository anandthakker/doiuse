/**
 * Scales images with an algorithm that preserves edges and contrast, without smoothing colors or introducing blur. This is intended for images such as pixel art. Official values that accomplish this for the `image-rendering` property are `crisp-edges` and `pixelated`.
 *
 * See: https://caniuse.com/css-crisp-edges
 */

/**
 * @type {import('../features').Feature}
 */
export default {
  'image-rendering': ['crisp-edges', 'pixelated'],
};
