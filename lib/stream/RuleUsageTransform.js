/* eslint-disable no-underscore-dangle */
import { Transform } from 'stream';

import postcss from 'postcss';
import sourcemap from 'source-map';

import DoIUse from '../DoIUse.js';

/** @typedef {import('../../data/Features.js').FeatureKeys} FeatureKeys */
/** @typedef {import('./SourceMapTransform.js').SourceMapTransformation} SourceMapTransformation */

export default class RuleUsageTransform extends Transform {
  /** @type {import("postcss").Processor} */
  #processor;

  #skipErrors;

  #filename;

  /**
   * @param {Object} options
   * @param {string} options.browsers
   * @param {FeatureKeys[]} [options.ignore]
   * @param {boolean} [options.skipErrors]
   * @param {string} [filename]  Filename for outputting source code locations.
   */
  constructor(options, filename = '<streaming css input>') {
    super({
      objectMode: true,
    });
    this.#processor = postcss([new DoIUse({
      browsers: options.browsers,
      ignore: options.ignore,
      // @ts-ignore Bad typings
      onFeatureUsage: (usage) => {
        this.push(usage);
      },
    })]);
    this.#filename = filename;
    this.#skipErrors = options.skipErrors;
  }

  /**
   * @param {SourceMapTransformation} rule
   * @param {any} encoding
   * @param {Function} callback
   */
  async _transform(rule, encoding, callback) {
    let caughtError;
    try {
      const mapper = new sourcemap.SourceMapGenerator();
      const lines = rule.content.split('\n');
      let oline = rule.line;
      let ocol = rule.column;
      for (let line = 0; line < lines.length; line++) {
        mapper.addMapping({
          generated: { line: line + 1, column: 1 },
          original: { line: oline, column: ocol },
          source: this.#filename,
        });
        mapper.addMapping({
          generated: { line: line + 1, column: lines[line].length },
          original: { line: oline, column: ocol + lines[line].length },
          source: this.#filename,
        });
        oline++;
        ocol = 1;
      }
      await this.#processor.process(rule.content, { from: this.#filename, map: { prev: mapper.toString() } });
    } catch (err) {
      if (this.#skipErrors) {
        this.emit('warning', err);
      } else {
        caughtError = err;
      }
    }
    callback(caughtError);
  }
}
