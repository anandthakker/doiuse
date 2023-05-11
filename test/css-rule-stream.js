import { createReadStream } from 'fs';
import { dirname, join as joinPath } from 'path';
import { PassThrough } from 'stream';
import { fileURLToPath } from 'url';

import Tokenize from 'css-tokenize';
import { test } from 'tap';

import SourceMapTransform from '../lib/stream/SourceMapTransform.js';

const selfPath = dirname(fileURLToPath(import.meta.url));

test('works', (t) => {
  const expected = [
    { line: 2, column: 1, content: 'div {\n  background: red;\n}' },
    { line: 4, column: 2, content: '.cls {\n  color: green;\n}' },
    { line: 8, column: 1, content: '#id {\n  font-size: 10px;\n}' },
    { line: 14, column: 1, content: '@media screen and (min-width: 1000px) {\n  a {\n    text-decoration: underline;\n  }\n}' },
    { line: 20, column: 1, content: 'a:hover {\n  font-weight: bold;  \n}' },
    { line: 24, column: 1, content: 'section \n\n\n{\n  margin: 0;\n  /* comment wthin a rule */\n  padding: 5px;\n}' },
    { line: 34, column: 1, content: 'body > * {\n  \n}' },
  ];

  t.plan(expected.length + 1);

  createReadStream(joinPath(selfPath, 'cases', 'generic', 'gauntlet.css'))
    .pipe(new Tokenize())
    .pipe(new SourceMapTransform())
    .pipe(new PassThrough({
      objectMode: true,
      transform: (chunk, encoding, callback) => {
        t.same(chunk, expected.shift());
        callback();
      },
      flush: (callback) => {
        t.ok(true);
        callback();
      },
    }));
});
