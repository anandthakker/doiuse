import FEATURES from '../data/features.js';
import { performFeatureCheck } from '../utils/util.js';

/**
 * @typedef DetectorCallbackArgument
 * @prop {!import('postcss').ChildNode} usage
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
 * @param {string} input
 * @return {string}
 */
function stripUrls(input) {
  return input.replaceAll(/url\([^)]*\)/g, 'url()');
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
        this.features[feature] = FEATURES[feature];
      }
    }
    /** @type {(keyof FEATURES & string)[]} */
    this.ignore = [];
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
      case DISABLE_FEATURE_COMMENT: {
        if (value === '') {
          // @ts-expect-error Skip cast
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
      }
      case ENABLE_FEATURE_COMMENT: {
        if (value === '') {
          this.ignore = [];
        } else {
          const without = new Set(value.split(',').map((feat) => feat.trim()));
          this.ignore = this.ignore.filter((index) => !without.has(index));
        }
        break;
      }
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
      if (child.type === 'comment') {
        this.comment(child);
        return;
      }

      for (const [feat] of Object.entries(this.features).filter(([, featValue]) => {
        if (!featValue) return false;
        if (typeof featValue === 'function') {
          return featValue(child);
        }
        if (Array.isArray(featValue)) {
          return featValue.some((function_) => function_(child));
        }
        if (child.type !== 'decl') {
          return false;
        }

        return Object.entries(featValue).some(([property, value]) => {
          if (property !== '' && property !== child.prop) return false;
          if (value === true) return true;
          if (value === false) return false;
          return performFeatureCheck(value, stripUrls(child.value));
        });
      })) {
        const feature = /** @type {keyof FEATURES} */ (feat);
        callback({ usage: child, feature, ignore: this.ignore });
      }
      if (child.type !== 'decl') {
        this.node(child, callback);
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
