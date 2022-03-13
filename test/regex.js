import safe from 'safe-regex';
import { test } from 'tap';

import FEATURES from '../data/features.js';
import { REGEXES as CssSel2Regexes } from '../data/features/css-sel2.js';
import { REGEXES as CssSel3Regexes } from '../data/features/css-sel3.js';

const regexes = new Set();

/**
 * @param {Array|Record<string,RegExp>|RegExp} entry
 * @return {void}
 */
function checkEntry(entry) {
  if (entry == null) return;
  if (entry instanceof RegExp) {
    regexes.add(entry);
    return;
  }
  if (typeof entry !== 'object') return;
  if (Array.isArray(entry)) {
    entry.forEach((item) => checkEntry(item));
    return;
  }

  Object.values(entry).forEach((item) => checkEntry(item));
}

checkEntry([
  FEATURES,
  CssSel2Regexes,
  CssSel3Regexes,
]);

for (const regex of regexes) {
  test(`Regex safety check: /${regex.source}/`, (t) => {
    t.ok(safe(regex));
    t.end();
  });
}
