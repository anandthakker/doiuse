import { PassThrough } from 'node:stream';

import { test } from 'tap';

import CssUsageDuplex from '../lib/stream/CssUsageDuplex.js';

const expected = [
  'css-sel3',
  'background-img-opts',
];

const expectedWithIgnore = [
  'background-img-opts',
];

test('streaming works', (t) => {
  const s = new CssUsageDuplex({ browsers: 'IE >= 8' });
  s.pipe(new PassThrough({
    objectMode: true,
    transform: (usage, enc, next) => {
      t.equal(usage.feature, expected.shift());
      next();
    },
    flush: (next) => {
      next();
      t.equal(expected.length, 0);
      t.end();
    },
  }));

  s.end('div:nth-child(2n-1) { background-size: cover; }');
});

test('streaming works with ignore option', (t) => {
  const s = new CssUsageDuplex({ browsers: 'IE >= 8', ignore: ['css-sel3'] });
  s.pipe(new PassThrough({
    objectMode: true,
    transform: (usage, enc, next) => {
      t.equal(usage.feature, expectedWithIgnore.shift());
      next();
    },
    flush: (next) => {
      next();
      t.equal(expectedWithIgnore.length, 0);
      t.end();
    },
  }));

  s.end('div:nth-child(2n-1) { background-size: cover; }');
});

test('gracefully emit error on bad browsers list', (t) => {
  t.plan(1);
  const s = new CssUsageDuplex({ browsers: 'Blargh!' });
  s.on('error', (error) => {
    t.ok(error);
  });
  s.end('a{}');
});
