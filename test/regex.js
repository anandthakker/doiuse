import safe from 'safe-regex';
import { test } from 'tap';

import FEATURES from '../data/Features.js';

const regexes = [];

for (const feature of Object.values(FEATURES)) {
  for (const property of Object.values(feature)) {
    if (!property || !(Array.isArray(property))) {
      continue;
    }

    for (const item of property) {
      if (item instanceof RegExp) {
        regexes.push(item);
      }
    }
  }
}

for (const regex of regexes) {
  test(`Regex safety check: /${regex.source}/`, (t) => {
    t.ok(safe(regex));
    t.end();
  });
}
