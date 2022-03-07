import FEATURES from '../data/Features.js';

/** @typedef {import('../data/Features.js').FeatureValue} FeatureValue */

/**
 * @typedef DetectorCallbackArgument
 * @prop {!import('postcss').Node} usage
 * @prop {keyof FEATURES} feature
 * @prop {(keyof FEATURES & string)[]} ignore
 */

/**
 * @callback DetectorCallback
 * @param {DetectorCallbackArgument} result
 * @return {any}
 */

const PLUGIN_OPTION_COMMENT = 'doiuse-';
const DISABLE_FEATURE_COMMENT = `${PLUGIN_OPTION_COMMENT}disable`;
const ENABLE_FEATURE_COMMENT = `${PLUGIN_OPTION_COMMENT}enable`;

/**
 * Strip the contents of url literals so they aren't matched
 * by our naive substring matching.
 * @param {string} str
 * @return {string}
 */
function stripUrls(str) {
  return str.replace(/url\([^)]*\)/g, 'url()');
}

/**
 * @param {string} str string to search in.
 * @return {(searchFor:FeatureValue) => boolean}
 */
function isFoundIn(str) {
  const strippedUrls = stripUrls(str);
  return (searchfor) => {
    if (searchfor instanceof RegExp) return searchfor.test(strippedUrls);
    if (typeof searchfor === 'function') return searchfor(strippedUrls);
    if (!strippedUrls) return false;
    return strippedUrls.includes(searchfor);
  };
}

/**
 * Detect the use of any of a given list of CSS features.
 * ```
 * var detector = new Detector(featureList)
 * detector.process(css, cb)
 * ```
 *
 * `featureList`: an array of feature slugs (see caniuse-db)
 * `cb`: a callback that gets called for each usage of one of the given features,
 * called with an argument like:
 * ```
 * {
 *   usage: {} // postcss node where usage was found
 *   feature: {} // caniuse-db feature slug
 *   ignore: {} // caniuse-db feature to ignore in current file
 * }
 * ```
 */
export default class Detector {
  /**
   * @param {(keyof FEATURES & string)[]} featureList an array of feature slugs (see caniuse-db)
   */
  constructor(featureList) {
    /** @type {Partial<FEATURES>} */
    this.features = {};
    for (const feature of featureList) {
      if (FEATURES[feature]) {
        // @ts-ignore Force
        this.features[feature] = FEATURES[feature];
      }
    }
    /** @type {(keyof FEATURES & string)[]} */
    this.ignore = [];
  }

  /**
   * @param {import('postcss').Declaration} declaration
   * @param {DetectorCallback} callback
   * @return {void}
   */
  decl(declaration, callback) {
    for (const [feat, featValue] of Object.entries(this.features)) {
      const feature = /** @type {keyof FEATURES} */ (feat);
      const properties = featValue.properties || [];
      const { values } = featValue;
      if (properties.some(isFoundIn(declaration.prop)) && (!values || values.some(isFoundIn(declaration.value)))) {
        callback({ usage: declaration, feature, ignore: this.ignore });
      }
    }
  }

  /**
   * @param {import('postcss').Rule} rule
   * @param {DetectorCallback} callback
   * @return {void}
   */
  rule(rule, callback) {
    for (const [feat, featValue] of Object.entries(this.features)) {
      const feature = /** @type {keyof FEATURES} */ (feat);
      const selectors = featValue.selectors || [];
      if (selectors.some(isFoundIn(rule.selector))) {
        callback({ usage: rule, feature, ignore: this.ignore });
      }
    }

    this.node(rule, callback);
  }

  /**
   * @param {import('postcss').AtRule} atrule
   * @param {DetectorCallback} callback
   * @return {void}
   */
  atrule(atrule, callback) {
    for (const [feat, featValue] of Object.entries(this.features)) {
      const feature = /** @type {keyof FEATURES} */ (feat);
      const atrules = featValue.atrules || [];
      const { params } = featValue;
      if (atrules.some(isFoundIn(atrule.name)) && (!params || params.some(isFoundIn(atrule.params)))) {
        callback({ usage: atrule, feature, ignore: this.ignore });
      }
    }

    this.node(atrule, callback);
  }

  /**
   * @param {import('postcss').Comment} comment
   * @return {void}
   */
  comment(comment) {
    const text = comment.text.toLowerCase();

    if (!text.startsWith(PLUGIN_OPTION_COMMENT)) return;
    const option = text.split(' ', 1)[0];
    const value = text.replace(option, '').trim();

    switch (option) {
      case DISABLE_FEATURE_COMMENT:
        if (value === '') {
          // @ts-ignore Missing cast
          this.ignore = Object.keys(this.features);
        } else {
          for (const feat of value.split(',')) {
            /** @type {any} */
            const f = feat.trim();
            if (!this.ignore.includes(f)) {
              this.ignore.push(f);
            }
          }
        }
        break;
      case ENABLE_FEATURE_COMMENT:
        if (value === '') {
          this.ignore = [];
        } else {
          const without = new Set(value.split(',').map((feat) => feat.trim()));
          this.ignore = this.ignore.filter((i) => !without.has(i));
        }
        break;
      default:
    }
  }

  /**
   * @param {import('postcss').Container} node
   * @param {DetectorCallback} callback
   * @return {void}
   */
  node(node, callback) {
    node.each((child) => {
      switch (child.type) {
        case 'rule':
          this.rule(child, callback);
          break;
        case 'decl':
          this.decl(child, callback);
          break;
        case 'atrule':
          this.atrule(child, callback);
          break;
        case 'comment':
          this.comment(child);
          break;
        default:
      }
    });
  }

  /**
   * @param {import('postcss').Root} node
   * @param {DetectorCallback} callback
   * @return {void}
   */
  process(node, callback) {
    //  Reset ignoring rules specified by inline comments per each file
    this.ignore = [];

    //  Recursively walk nodes in file
    this.node(node, callback);
  }
}
