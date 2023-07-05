import CssUsageDuplex from '../lib/stream/CssUsageDuplex.js';

/**
 * @param  {ConstructorParameters<typeof CssUsageDuplex>} options
 * @return {CssUsageDuplex}
 */
export default function index(...options) {
  return new CssUsageDuplex(...options);
}
