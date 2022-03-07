import { test } from 'tap';

import BrowserSelection from '../lib/BrowserSelection.js';

import { hasKeys } from './utils.js';

test('provides list of selected browsers', (t) => {
  const data = BrowserSelection.missingSupport(['ie >= 8'])
    .browsers.sort((a, b) => Number(a[1]) - Number(b[1]));
  t.same(data, [
    [
      'ie',
      '8',
    ],
    [
      'ie',
      '9',
    ],
    [
      'ie',
      '10',
    ],
    [
      'ie',
      '11',
    ],
  ]);

  t.end();
});

test('for browser request ie >= 7, safari >= 6, opera >= 10.1', (t) => {
  const data = BrowserSelection.missingSupport([
    'ie >= 7',
    'safari >= 6',
    'opera >= 10.1',
  ]).features;

  const bgimgopts = data['background-img-opts'];
  hasKeys(t, bgimgopts, ['missing', 'partial', 'title', 'missingData', 'partialData', 'caniuseData']);

  const missing = bgimgopts.missingData;
  const partial = bgimgopts.partialData;
  hasKeys(t, missing, ['ie']);
  hasKeys(t, missing.ie, ['7', '8']);
  hasKeys(t, partial, ['safari', 'opera']);
  hasKeys(t, partial.safari, ['6', '6.1']);
  hasKeys(t, partial.opera, ['10.0-10.1']);
  t.end();
});

test('partialData only yields features partially supported by selected browser', (t) => {
  const data = BrowserSelection.missingSupport(['ie 8']).features;
  const partial = [];
  for (const value of Object.values(data)) {
    if (value.partialData) {
      partial.push(value);
    }
  }
  for (const featureData of Object.values(partial)) {
    hasKeys(t, featureData.partialData, ['ie']);
  }
  t.end();
});

test('missingData only yields features not supported by selected browser', (t) => {
  const data = BrowserSelection.missingSupport(['ie 8']).features;
  const missing = [];
  for (const value of Object.values(data)) {
    if (value.missingData) {
      missing.push(value);
    }
  }
  for (const featureData of Object.values(missing)) {
    hasKeys(t, featureData.missingData, ['ie']);
  }
  t.end();
});
