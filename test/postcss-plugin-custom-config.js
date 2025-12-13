import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import { test } from 'tap';

import postcssrc from 'postcss-load-config';

test('loads postcss plugin with an custom configuration object using postcss-load-config', async (t) => {
  const { plugins } = await postcssrc(null, fileURLToPath(`${import.meta.url}/../fixtures/custom-postcssrc/.postcssrc.json`));
  const { messages } = await postcss(plugins).process('html { display: flex }');

  t.equal(messages[0].text, 'CSS Flexible Box Layout Module only partially supported by: IE (11) (flexbox)');
  t.end();
});
