import fs from 'node:fs';
import { dirname, join as joinPath } from 'node:path';
import { fileURLToPath } from 'node:url';

import mock from 'mock-fs';
import postcss from 'postcss';
import atImport from 'postcss-import';
import { test } from 'tap';

import doIUse from '../lib/DoIUse.js';

import { hasKeys } from './utils.js';

const selfPath = dirname(fileURLToPath(import.meta.url));

test('leaves css alone by default', (t) => {
  const css = fs.readFileSync(joinPath(selfPath, './cases/generic/gradient.css')).toString();
  // @ts-expect-error This object shape still works with postcss
  const out = postcss(doIUse({
    browsers: [
      'ie >= 7',
      'safari >= 6',
      'opera >= 10.1',
    ],
  })).process(css).css;
  t.equal(out, css);
  t.end();
});

test('calls back for unsupported feature usages', async (t) => {
  const css = fs.readFileSync(joinPath(selfPath, './cases/generic/gradient.css'));
  let count = 0;
  // @ts-expect-error This object shape still works with postcss
  await postcss(doIUse({
    browsers: ['ie 8'],
    onFeatureUsage(usageInfo) {
      count += 1;
      hasKeys(t, usageInfo, ['feature', 'featureData', 'usage', 'message']);
      hasKeys(t, usageInfo.featureData, ['title', 'missing', 'missingData', 'caniuseData']);
    },
  })).process(css);
  t.equal(count, 4);
  t.end();
});

test('ignores specified features and calls back for the others', async (t) => {
  const css = fs.readFileSync(joinPath(selfPath, './cases/generic/gradient.css'));
  let count = 0;
  // @ts-expect-error This object shape still works with postcss
  await postcss(doIUse({
    browsers: ['ie 8'],
    ignore: [
      'css-gradients',
    ],
    onFeatureUsage(usageInfo) {
      count += 1;
      hasKeys(t, usageInfo, ['feature', 'featureData', 'usage', 'message']);
      hasKeys(t, usageInfo.featureData, ['title', 'missing', 'missingData', 'caniuseData']);
    },
  })).process(css);
  t.equal(count, 2);
  t.end();
});

test('ignores specified files and calls back for others', async (t) => {
  const ignoreCss = fs.readFileSync(joinPath(selfPath, './cases/generic/ignore-file.css'));
  const processCss = fs.readFileSync(joinPath(selfPath, './cases/generic/gradient.css'));
  let run = false;

  // @ts-expect-error This object shape still works with postcss
  const processor = postcss(doIUse({
    browsers: ['ie 6'],
    ignoreFiles: ['**/ignore-file.css'],
    onFeatureUsage() {
      run = true;
    },
  }));

  await processor.process(ignoreCss, { from: './cases/generic/ignore-file.css' });

  t.notOk(run, 'should be false');
  await processor.process(processCss, { from: './cases/generic/gradient.css' });
  t.ok(run, 'should be true');
  t.end();
});

test('ignores rules from some imported files, and not others', async (t) => {
  const cssPath = joinPath(selfPath, './cases/generic/ignore-import.css');
  const css = fs.readFileSync(cssPath);
  let count = 0;

  await postcss([atImport(),
    doIUse({
      browsers: ['ie 6'],
      ignoreFiles: ['**/ignore-file.css'],
      onFeatureUsage() {
        count += 1;
      },
    })]).process(css, { from: cssPath });
  t.equal(count, 2);
  t.end();
});

test('ignores rules specified in comments', async (t) => {
  const ignoreCssPath = joinPath(selfPath, './cases/generic/ignore-comment.css');
  const ignoreCss = fs.readFileSync(ignoreCssPath);

  const processCssPath = joinPath(selfPath, './cases/generic/ignore-file.css');
  const processCss = fs.readFileSync(processCssPath);

  let count = 0;

  const processor = postcss([atImport(),
    doIUse({
      browsers: ['ie 6'],
      onFeatureUsage() {
        count += 1;
      },
    })]);

  await processor.process(ignoreCss, { from: ignoreCssPath });

  t.equal(count, 2);

  await processor.process(processCss, { from: processCssPath });
  t.equal(count, 3, 'inline css disabing rules must apply only to current file');
  t.end();
});

test('info with browserslist file', (t) => {
  mock({
    browserslist: '# Comment\nSafari 8\nIE >= 11',
  });

  const actual = doIUse({}).info().browsers;
  const expected = [['ie', '11'], ['safari', '8']];

  t.same(actual, expected);

  mock.restore();

  t.end();
});

test('info with no browserslist file or browsers config', (t) => {
  const actual = doIUse({}).info().browsers;

  const expected = doIUse({
    browsers: doIUse.default,
  }).info().browsers;

  t.same(actual, expected);

  t.end();
});
