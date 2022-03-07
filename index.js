import DoIUse from './lib/DoIUse.js';

export { default as Detector } from './lib/Detector.js';
export { default as DoIUse } from './lib/DoIUse.js';
export { default as BrowserSelection } from './lib/BrowserSelection.js';

/**
 * @param  {ConstructorParameters<typeof DoIUse>} options
 * @return {DoIUse}
 */
export default function index(...options) {
  return new DoIUse(...options);
}
