import DoIUse from '../lib/DoIUse.js';

/**
 * @param  {ConstructorParameters<typeof DoIUse>} options
 * @return {DoIUse}
 */
export default function index(...options) {
  return new DoIUse(...options);
}

index.postcss = function postcssProxy(root, result) {
  const instance = new DoIUse();
  return instance.postcss(root, result);
};
