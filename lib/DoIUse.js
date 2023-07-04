import multimatch from 'multimatch';

import BrowserSelection from './BrowserSelection.js';
import Detector from './Detector.js';
import { checkPartialSupport } from './mdn/checkPartialSupport.js';

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

export default class DoIUse {
  static default = null;

  /**
   * @param {Object} [options]
   * @param {ConstructorParameters<typeof BrowserSelection>[0]} [options.browsers]
   * @param {FeatureKeys[]} [options.ignore]
   * @param {OnFeatureUsage} [options.onFeatureUsage]
   * @param {string[]} [options.ignoreFiles]
   */
  constructor(options = {}) {
    this.browserQuery = options.browsers;
    this.onFeatureUsage = options.onFeatureUsage;
    this.ignoreOptions = options.ignore;
    this.ignoreFiles = options.ignoreFiles;
    this.info = this.info.bind(this);
    this.postcss = this.postcss.bind(this);
  }

  /**
   * @param {Object} [opts]
   * @param {ConstructorParameters<typeof BrowserSelection>[1]} [opts.from]
   */
  info(opts = {}) {
    const { browsers, features } = BrowserSelection.missingSupport(this.browserQuery, opts.from);

    return {
      browsers,
      features,
    };
  }

  /** @type {import('postcss').TransformCallback} */
  postcss(css, result) {
    let from;
    if (css.source && css.source.input) {
      from = css.source.input.file;
    }
    const { features } = BrowserSelection.missingSupport(this.browserQuery, from);
    // @ts-ignore Needs cast
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
      if (this.ignoreFiles && multimatch(usage.source.input.from, this.ignoreFiles).length > 0) {
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
        const partialSupportDetails = checkPartialSupport(
          usage,
          this.browserQuery,
        );

        if (partialSupportDetails.partialSupportMessage) {
          messages.push(partialSupportDetails.partialSupportMessage);
        } else if (!partialSupportDetails.ignorePartialSupport) {
          messages.push(`only partially supported by: ${data.partial}`);
        }
      }

      // because messages can be suppressed by checkPartialSupport, we need to make sure
      // we still have messages before we warn
      if (messages.length === 0) return;

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
