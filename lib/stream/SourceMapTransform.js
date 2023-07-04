/* eslint-disable no-underscore-dangle */
import { Transform } from 'node:stream';

const NEW_LINE_CHAR = '\n'.codePointAt(0);

/**
 * @typedef {Object} SourceMapTransformation
 * @prop {number} line
 * @prop {number} column
 * @prop {string} content
 */

export default class SourceMapTransform extends Transform {
  constructor() {
    super({ objectMode: true });
  }

  /**
   * @type {?{location:[number,number], buffers: Buffer[]}}
   * buffer for the current incoming rule.
   */
  #current = null;

  /** track depth to handle rules nested in at-rules. */
  #depth = 0;

  /** track this and pass it downstream for source mapping. */
  #line = 1;

  /** track this and pass it downstream for source mapping. */
  #column = 1;

  /**
   * @param {[string,Buffer]} chunk
   * @param {any} encoding
   * @param {Function} callback
   */
  _transform([type, buf], encoding, callback) {
    if ((type === 'rule_start' || type === 'atrule_start')) {
      this.#depth += 1;
    }
    if (this.#depth > 0 && !this.#current) {
      this.#current = { location: [this.#line, this.#column], buffers: [] };
    }
    if (type === 'rule_end' || type === 'atrule_end') {
      this.#depth -= 1;
    }

    if (this.#current) {
      this.#current.buffers.push(buf);
      if (this.#depth === 0) {
        // Push rule
        this.push({
          line: this.#current.location[0],
          column: this.#current.location[1],
          content: Buffer.concat(this.#current.buffers).toString(),
        });
        this.#current = null;
      }
    }

    // Update position
    for (const char of buf) {
      if (char === NEW_LINE_CHAR) {
        this.#line += 1;
        this.#column = 1;
      } else {
        this.#column += 1;
      }
    }

    callback();
  }
}
