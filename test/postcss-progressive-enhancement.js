import { test } from 'tap';
import postcss from 'postcss';

import DoIUse from '../lib/DoIUse.js';

test('Progressive enhancement using repeated CSS properties', (t) => {
  const css = `
    p {
      background-color: black;
      background-color: rgba(0, 0, 0, 0.5);
    }
  `;

  const result = postcss(new DoIUse({
    browsers: ['ie >= 6'],
  })).process(css);
  const warnings = result.warnings();

  t.equal(warnings.length, 0, 'No warnings');

  t.end();
});
