/* eslint-disable canonical/filename-match-exported */
import { readdirSync } from 'fs';

/** @type {import('rollup').RollupOptions[]} */
const configs = [];

/** @type {string[]} */
const files = readdirSync('./exports');
for (const file of files) {
  const [name, afterExt, ...afterExtExtra] = file.split('.js');
  if (afterExt !== '' || afterExtExtra.length !== 0) continue;
  configs.push({
    input: `exports/${file}`,
    output: {
      exports: 'default',
      format: 'cjs',
      file: `exports/${name}.cjs`,
    },
  });
}
console.log(configs);
export default configs;
