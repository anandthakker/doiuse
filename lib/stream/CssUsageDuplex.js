/* eslint-disable no-underscore-dangle */

import { pipeline } from 'stream';

import Tokenize from 'css-tokenize';
import Duplexify from 'duplexify';

import RuleUsageTransform from './RuleUsageTransform.js';
import SourceMapTransform from './SourceMapTransform.js';

/** @typedef {import('../../data/features.js').FeatureKeys} FeatureKeys */

export default class CssUsageDuplex extends Duplexify {
  /**
   * @param {Object} options
   * @param {string} options.browsers
   * @param {FeatureKeys[]} [options.ignore]
   * @param {boolean} [options.skipErrors]
   * @param {string} [filename]  Filename for outputting source code locations.
   */
  constructor(options, filename) {
    const streams = [
      new Tokenize(),
      new SourceMapTransform(),
      new RuleUsageTransform(options, filename),
    ];
    pipeline(
      // @ts-ignore Bad typings
      ...streams,
      () => {
        // noop (Error handled by Duplexify)
      },
    );
    super(streams[0], streams[streams.length - 1], { objectMode: true });
  }
}
