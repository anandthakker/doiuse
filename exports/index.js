import DoIUse from '../lib/DoIUse.js';

/**
 * @param  {ConstructorParameters<typeof DoIUse>} options
 * @return {DoIUse}
 */
export default function index(...options) {
  return new DoIUse(...options);
}
