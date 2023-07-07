import { checkCSSLengthUnits } from '../../utils/util.js';

/**
 * Small, Large, and Dynamic viewport units
 * Viewport units similar to `vw` and `vh` that are based on shown or hidden
 * browser UI states to address shortcomings of the original units. Currently
 * defined as the
 * `sv*` units (`svb`, `svh`, `svi`, `svmax`, `svmin`, `svw`),
 * `lv*` units (`lvb`, `lvh`, `lvi`, `lvmax`, `lvmin`, `lvw`),
 * `dv*` units (`dvb`, `dvh`, `dvi`, `dvmax`, `dvmin`, `dvw`)
 * and the logical `vi`/`vb` units.
 * @see https://caniuse.com/viewport-unit-variants
 * @type {import('../features').Feature}
 */
export default checkCSSLengthUnits(
  /* sv* units */
  'svb',
  'svh',
  'svi',
  'svmax',
  'svmin',
  'svw',

  /* lv* units */
  'lvb',
  'lvh',
  'lvi',
  'lvmax',
  'lvmin',
  'lvw',

  /* dv* units */
  'dvb',
  'dvh',
  'dvi',
  'dvmax',
  'dvmin',
  'dvw',

  /* vi/vb units */
  'vi',
  'vb',
);
