import { readFileSync } from 'node:fs';
import { dirname, join as joinPath } from 'node:path';
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
function spy() {
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

/**
 * @param {string} tc
 * @param {string} cssString
 * @param {Object} expected
 */
function runTest(tc, cssString, expected) {
  /** @type {any[]} */
  const features = Object.keys(expected).sort();

  test(`detecting CSS features (${tc.replace('.css', '')})`, (t) => {
    const detector = new Detector(features);
    const callback = spy();
    detector.process(postcss.parse(cssString), callback);

    const resultKeys = Object.keys(callback.results).sort();
    for (const feature in expected) {
      if (expected[feature] === 0) {
        t.notOk(callback.results[feature]);
      } else {
        t.same(resultKeys, features);
        t.equal(callback.results[feature]?.length, expected[feature], `count of ${feature}`);
      }
    }

    t.end();
  });
}

// read in the test cases from /cases/**/*.css
const cases = [];
for await (const caseFileName of getFiles(joinPath(selfPath, 'cases'))) {
  const cssString = readFileSync(caseFileName).toString();
  const parsed = parseTestCase(cssString);
  if (parsed && !caseFileName.includes('unimplemented')) {
    const testCase = {
      name: caseFileName,
      expected: parsed.expected,
      cssString,
    };
    cases.push(testCase);
  }
}

for (const testCase of cases) {
  runTest(testCase.name, testCase.cssString, testCase.expected);
}
