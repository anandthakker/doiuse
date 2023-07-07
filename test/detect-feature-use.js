import { readFileSync } from 'node:fs';
import { dirname, join as joinPath, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import postcss from 'postcss';
import { test } from 'tap';

import Detector from '../lib/Detector.js';
import { getFiles } from '../utils/getFiles.js';

const selfPath = dirname(fileURLToPath(import.meta.url));

/**
 * Parse the feature-key: count lines in the leading comment of
 * each test case fixture.
 * @param {string} cssString
 */
function parseTestCase(cssString) {
  const meta = /\s*\/\*(\s*only)?\s*expect:\s*([\d\s:A-Za-z-]*)/;
  const matches = cssString.match(meta);
  if (!matches) return null;

  const features = {};
  let hasFeature = false;
  for (const s of matches[2].split('\n')) {
    if (!s.trim()) continue;
    hasFeature = true;

    const line = s.replace(/\s*/, '').split(':');
    const feat = line[0];
    const count = +line[1];
    features[feat] = count;
  }

  if (!hasFeature) return null;

  return {
    only: !!matches[1],
    expected: features,
  };
}

/**
 * make a spy callback.
 *
 * spy functions save results from calls on `spyFn.results`.
 */
function createSpyCallback() {
  const results = [];
  /** @param {any} firstArgument */
  function spyFunction(firstArgument) {
    const { feature } = firstArgument;
    const { usage } = firstArgument;
    const entry = {
      feature,
      location: usage.source.start,
      selector: usage.selector,
      property: usage.property,
      value: usage.value,
    };

    if (!results[feature]) {
      results[feature] = [];
    }

    return results[feature].push(entry);
  }
  spyFunction.results = results;
  return spyFunction;
}

// read in the test cases from /cases/**/*.css
const casePath = joinPath(selfPath, 'cases');
for await (const caseFileName of getFiles(casePath)) {
  const testFilePath = relative(casePath, caseFileName);
  if (testFilePath.startsWith('unimplemented/')) continue;

  const cssString = readFileSync(caseFileName).toString();
  const parsed = parseTestCase(cssString);
  if (!parsed) continue;

  const { expected } = parsed;

  /** @type {any[]} */
  const features = Object.keys(expected).sort();

  test(`detecting CSS features (${testFilePath})`, (t) => {
    const detector = new Detector(features);
    const spyCallback = createSpyCallback();
    detector.process(postcss.parse(cssString), spyCallback);
    const { results } = spyCallback;

    const resultKeys = Object.keys(results).sort();

    for (const feature in expected) {
      if (expected[feature] === 0) {
        t.notOk(results[feature]);
      } else {
        t.same(resultKeys, features);
        t.equal(results[feature]?.length, expected[feature], `count of ${feature}`);
      }
    }

    t.end();
  });
}
