/**
 * CSS Regions
 * Method of flowing content into multiple elements, allowing magazine-like layouts. While once supported in WebKit-based browsers and Internet Explorer, implementing the feature is no longer being pursued by any browser.
 * @see https://caniuse.com/css-regions
 */

/**
 * @type {import('../features').Feature}
 */
export default {
  'flow-into': true,
  'flow-from': true,
  '-webkit-flow-into': true,
  '-webkit-flow-from': true,
};
