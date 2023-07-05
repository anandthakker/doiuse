import browserslist from 'browserslist';
import * as caniuse from 'caniuse-lite';

import FEATURES from '../data/features.js';
import { formatBrowserName } from '../utils/util.js';

/**
 * @template T
 * @typedef {{missing: T, partial: T}} Filter
 */

/**
 * @typedef {Object} MissingSupportResultStats
 * @prop {string} title
 * @prop {caniuse.Feature} caniuseData
 * @prop {string} [missing]
 * @prop {Record<string, Record<string, string>>} [missingData]
 * @prop {string} [partial]
 * @prop {Record<string, Record<string, string>>} [partialData]
 */

/**
 * @typedef {Partial<Record<keyof FEATURES, MissingSupportResultStats>>} BrowserSupportStats
 */

/**
 * @typedef {Object} MissingSupportResult
 * @prop {string[][]} browsers
 * @prop {Partial<Record<keyof FEATURES, MissingSupportResultStats>>} features
 */

export default class BrowserSelection {
  #list;

  /**
   * @param {string | string[]} [query]
   * @param {string | false} [from]
   */
  constructor(query, from) {
    this.browsersRequest = query;
    const options = from ? { path: from } : {};
    this.#list = browserslist(this.browsersRequest, options).map((browser) => browser.split(' '));
  }

  /**
   * @param {string} browser
   * @param {string} version
   * @return {string[]|undefined}
   */
  test(browser, version) {
    const versions = version.split('-');

    if (versions.length === 1) {
      versions.push(versions[0]);
    }

    return this.#list.find(([b, v]) => b === browser && v >= versions[0] && v <= versions[1]);
  }

  list() {
    return [...this.#list];
  }

  /**
   * @param {Record<string, Record<string, string>>} browserStats
   * @return {string}
   */
  static lackingBrowsers(browserStats) {
    const result = [];
    for (const browser of Object.keys(browserStats)) {
      result.push(formatBrowserName(browser, Object.keys(browserStats[browser])));
    }
    return result.join(', ');
  }

  /**
   * @param {import('caniuse-lite').StatsByAgentID} stats
   * @return {Filter<Record<string,Record<string, string>>>}
   */
  filterStats(stats) {
  /** @type {Filter<Record<string,Record<string, string>>>} */
    const result = { missing: {}, partial: {} };
    for (const [browser, versions] of Object.entries(stats)) {
    /** @type {Filter<Record<string,string>>} */
      const feature = { missing: {}, partial: {} };
      for (const [version, support] of Object.entries(versions)) {
        const selected = this.test(browser, version);

        // check if browser is NOT fully (i.e., don't have 'y' in their stats) supported
        if (!selected) continue;
        if ((/(^|\s)y($|\s)/.test(support))) continue;
        // when it's not partially supported ('a'), it's missing
        const type = (/(^|\s)a($|\s)/.test(support) ? 'partial' : 'missing');

        if (!feature[type]) {
          feature[type] = {};
        }

        feature[type][selected[1]] = support;
      }
      if (Object.keys(feature.missing).length > 0) {
        result.missing[browser] = feature.missing;
      }

      if (Object.keys(feature.partial).length > 0) {
        result.partial[browser] = feature.partial;
      }
    }
    return result;
  }

  /**
   * Get data on CSS features not supported by the given autoprefixer-like
   * browser selection.
   * @return {BrowserSupportStats} `features` is an array of:
   * ```
   * {
   *   'feature-name': {
   *     title: 'Title of feature'
   *     missing: "IE (8), Chrome (31)"
   *     missingData: {
   *       // map of browser -> version -> (lack of)support code
   *       ie: { '8': 'n' },
   *       chrome: { '31': 'n' }
   *     }
   *     partialData: {
   *       // map of browser -> version -> (partial)support code
   *       ie: { '7': 'a' },
   *       ff: { '29': 'a #1' }
   *     }
   *     caniuseData: {
   *       // caniuse-db json data for this feature
   *     }
   *   },
   *   'feature-name-2': {} // etc.
   * }
   * ```
   *
   * `feature-name` is a caniuse-db slug.
   */
  compileBrowserSupport() {
    /** @type {Partial<Record<keyof FEATURES, MissingSupportResultStats>>} */
    const result = {};

    for (const key of Object.keys(FEATURES)) {
      const feature = /** @type {keyof FEATURES} */ (key);
      const packedFeature = caniuse.features[feature];
      const featureData = caniuse.feature(packedFeature);
      const lackData = this.filterStats(featureData.stats);
      const missingData = lackData.missing;
      const partialData = lackData.partial;
      // browsers with missing or partial support for this feature
      const missing = BrowserSelection.lackingBrowsers(missingData);
      const partial = BrowserSelection.lackingBrowsers(partialData);

      if (missing.length > 0 || partial.length > 0) {
        result[feature] = {
          title: featureData.title,
          caniuseData: featureData,
          ...(missing.length > 0 ? { missingData, missing } : null),
          ...(partial.length > 0 ? { partialData, partial } : null),
        };
      }
    }

    return result;
  }

  /**
   * @see BrowserSelection.compileBrowserSupport
   * @param {ConstructorParameters<typeof this>} constructorParameters
   * @return {MissingSupportResult} `{browsers, features}`
   */
  static missingSupport(...constructorParameters) {
    const selection = new BrowserSelection(...constructorParameters);
    return {
      browsers: selection.list(),
      features: selection.compileBrowserSupport(),
    };
  }
}
