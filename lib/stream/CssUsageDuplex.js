/* eslint-disable no-underscore-dangle */

import { pipeline } from 'node:stream';

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
   * @param {string} [filename] Filename for outputting source code locations.
   */
  constructor(options, filename) {
    const streams = [
      new Tokenize(),
      new SourceMapTransform(),
      new RuleUsageTransform(options, filename),
    ];
    pipeline(
      // @ts-expect-error Bad typings
      ...streams,
      () => {
        // noop (Error handled by Duplexify)
      },
    );
    super(streams[0], streams.at(-1), { objectMode: true });
  }
}
