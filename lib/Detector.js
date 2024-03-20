import FEATURES from '../data/features.js';
import { performFeatureCheck, stripUrls } from '../utils/util.js';

/** @typedef {import('../data/features.js').FeatureKeys} FeatureKeys */
/** @typedef {import('../data/features.js').RuleCheck} RuleCheck */

/**
 * @typedef DetectorCallbackArgument
 * @prop {!import('postcss').ChildNode} usage
 * @prop {FeatureKeys} feature
 * @prop {(FeatureKeys & string)[]} ignore
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
 * Normalise a Feature into a RuleCheck function.
 * @param {import('../data/features.js').Feature} feature
 * @return {RuleCheck}
 */
function normaliseFeature(feature) {
  if (typeof feature === 'function') {
    return feature;
  }
  if (Array.isArray(feature)) {
    return (child) => feature.some((function_) => function_(child));
  }
  if (typeof feature === 'object') {
    const properties = Object.entries(feature);
    return (child) => {
      if (child.type !== 'decl') {
        return false;
      }
      return properties.some(([property, value]) => {
        if (property !== '' && property !== child.prop) return false;
        if (value === true) return true;
        if (value === false) return false;
        return performFeatureCheck(value, stripUrls(child.value));
      });
    };
  }
  throw new TypeError(`Invalid feature definition: ${feature}`);
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
   * @param {(FeatureKeys & string)[]} featureList an array of feature slugs (see caniuse-db)
   */
  constructor(featureList) {
    /** @type {Map<FeatureKeys, RuleCheck>} */
    this.features = new Map();
    for (const featureName of featureList) {
      const feature = FEATURES[featureName];
      if (feature != null) {
        this.features.set(featureName, normaliseFeature(feature));
      }
    }
    /** @type {(FeatureKeys & string)[]} */
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
          this.ignore = [...this.features.keys()];
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

      for (const [feature, ruleCheck] of this.features) {
        if (ruleCheck(child)) {
          callback({ usage: child, feature, ignore: this.ignore });
        }
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
