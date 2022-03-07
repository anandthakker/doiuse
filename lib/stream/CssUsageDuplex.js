/* eslint-disable no-underscore-dangle */

import { pipeline } from 'stream';

import Tokenize from 'css-tokenize';
import Duplexify from 'duplexify';

import RuleUsageTransform from './RuleUsageTransform.js';
import SourceMapTransform from './SourceMapTransform.js';

export default class CssUsageDuplex extends Duplexify {
  /**
   * @param {Object} options
   * @param {string} options.browsers
   * @param {(keyof FEATURES)[]} [options.ignore]
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
      ...streams,
      (err) => {
        if (err) {
          this.emit('err', err);
        }
      },
    );
    super(streams[0], streams[streams.length - 1], { objectMode: true });
  }
}
