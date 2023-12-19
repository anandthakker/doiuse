/* eslint-disable no-underscore-dangle */
import { Transform } from 'node:stream';

import postcss from 'postcss';
import sourcemap from 'source-map';

import DoIUse from '../DoIUse.js';

/** @typedef {import('../../data/features.js').FeatureKeys} FeatureKeys */
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
      for (const [lineNumber, content] of lines.entries()) {
        mapper.addMapping({
          generated: { line: lineNumber + 1, column: 1 },
          original: { line: oline, column: ocol },
          source: this.#filename,
        });
        mapper.addMapping({
          generated: { line: lineNumber + 1, column: content.length },
          original: { line: oline, column: ocol + content.length },
          source: this.#filename,
        });
        oline += 1;
        ocol = 1;
      }
      await this.#processor.process(rule.content, {
        from: this.#filename, map: { prev: mapper.toString() },
      });
    } catch (error) {
      if (this.#skipErrors) {
        this.emit('warning', error);
      } else {
        caughtError = error;
      }
    }
    callback(caughtError);
  }
}
