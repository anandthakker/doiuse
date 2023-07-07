import { checkCSSLengthUnits } from '../../utils/util.js';

/**
 * Unit representing the width of the character "0" in the current font, of particular use in combination with monospace fonts.
 * @see https://caniuse.com/ch-unit
 * @type {import('../features').Feature}
 */
export default checkCSSLengthUnits('ch');
