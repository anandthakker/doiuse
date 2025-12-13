import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import { test } from 'tap';

import postcssrc from 'postcss-load-config';

test('loads postcss plugin with an empty configuration object using postcss-load-config', async (t) => {
  const { plugins } = await postcssrc(null, fileURLToPath(`${import.meta.url}/../fixtures/empty-postcssrc/.postcssrc.json`));
  const { messages } = await postcss(plugins).process('.radial { background: radial-gradient(ellipse farthest-corner, black, white); }');

  t.equal(messages[0].text, 'CSS Gradients not supported by: Opera Mini (all) (css-gradients)');
  t.end();
});
