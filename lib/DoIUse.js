import { Minimatch } from 'minimatch';

import BrowserSelection from './BrowserSelection.js';
import Detector from './Detector.js';

/** @typedef {import('../data/features.js').FeatureKeys} FeatureKeys */

/**
 * @typedef {Object} OnFeatureUsageArguments
 * @prop {FeatureKeys} feature
 * @prop {import('./BrowserSelection.js').MissingSupportResultStats|undefined} featureData
 * @prop {import('postcss').Node} usage
 * @prop {string} message
 */

/**
 * @callback OnFeatureUsage
 * @param {OnFeatureUsageArguments} result
 * @return {any}
 */

/**
 * @typedef {Object} DoIUseOptions
 * @prop {ConstructorParameters<typeof BrowserSelection>[0]} [browsers]
 * @prop {FeatureKeys[]} [ignore]
 * @prop {OnFeatureUsage} [onFeatureUsage]
 * @prop {string[]} [ignoreFiles]
 */

export default class DoIUse {
  static default = null;

  /**
   * @param {DoIUseOptions} [optionsOrBrowserQuery]
   */
  constructor(optionsOrBrowserQuery) {
    const options = (typeof optionsOrBrowserQuery === 'string')
      ? { browsers: optionsOrBrowserQuery }
      : { ...optionsOrBrowserQuery };
    this.browserQuery = options.browsers;
    this.onFeatureUsage = options.onFeatureUsage;
    this.ignoreOptions = options.ignore;
    this.ignoreFiles = options.ignoreFiles;
    // Same semantics as multimatch: the last matching pattern wins, `!` un-ignores.
    // optimizationLevel 0 keeps `..` literal, as minimatch 3 did.
    this.ignoreFileMatchers = [options.ignoreFiles || []].flat().map((pattern) => {
      const negate = pattern.startsWith('!');
      return {
        negate,
        matcher: new Minimatch(negate ? pattern.slice(1) : pattern, { optimizationLevel: 0 }),
      };
    });
    this.info = this.info.bind(this);
    this.postcss = this.postcss.bind(this);
  }

  /**
   * @param {Object} [options]
   * @param {ConstructorParameters<typeof BrowserSelection>[1]} [options.from]
   */
  info(options = {}) {
    const { browsers, features } = BrowserSelection.missingSupport(this.browserQuery, options.from);

    return {
      browsers,
      features,
    };
  }

  /**
   * @param {string} file
   * @return {boolean}
   */
  isIgnoredFile(file) {
    let ignored = false;
    for (const { negate, matcher } of this.ignoreFileMatchers) {
      // eslint-disable-next-line unicorn/prefer-regexp-test -- Minimatch#match, not String#match
      if (matcher.match(file)) ignored = !negate;
    }
    return ignored;
  }

  /** @type {import('postcss').TransformCallback} */
  postcss(css, result) {
    let from;
    if (css.source && css.source.input) {
      from = css.source.input.file;
    }
    const { features } = BrowserSelection.missingSupport(this.browserQuery, from);
    // @ts-expect-error Needs cast
    const detector = new Detector(Object.keys(features));

    return detector.process(css, ({ feature, usage, ignore }) => {
      if (ignore && ignore.includes(feature)) {
        return;
      }

      if (this.ignoreOptions && this.ignoreOptions.includes(feature)) {
        return;
      }

      if (!usage.source) {
        throw new Error('No source?');
      }
      if (this.isIgnoredFile(usage.source.input.from)) {
        return;
      }

      const data = features[feature];
      if (!data) {
        throw new Error('No feature data?');
      }
      const messages = [];
      if (data.missing) {
        messages.push(`not supported by: ${data.missing}`);
      }
      if (data.partial) {
        messages.push(`only partially supported by: ${data.partial}`);
      }

      let message = `${data.title} ${messages.join(' and ')} (${feature})`;

      result.warn(message, { node: usage, plugin: 'doiuse' });

      if (this.onFeatureUsage) {
        if (!usage.source) {
          throw new Error('No usage source?');
        }
        const { start, input } = usage.source;
        if (!start) {
          throw new Error('No usage source start?');
        }

        const map = css.source && css.source.input.map;
        const mappedStart = map && map.consumer().originalPositionFor(start);

        const file = (mappedStart && mappedStart.source) || input.file || input.from;
        const line = (mappedStart && mappedStart.line) || start.line;
        const column = (mappedStart && mappedStart.column) || start.column;

        message = `${file}:${line}:${column}: ${message}`;

        this.onFeatureUsage({
          feature,
          featureData: features[feature],
          usage,
          message,
        });
      }
    });
  }
}
