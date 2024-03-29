/* eslint-disable canonical/filename-match-exported */
import { readdirSync } from 'node:fs';

/** @type {import('rollup').RollupOptions[]} */
const configs = [];

/** @type {string[]} */
const files = readdirSync('./exports');
for (const file of files) {
  const [name, afterExtension, ...afterExtensionExtra] = file.split('.js');
  if (afterExtension !== '' || afterExtensionExtra.length > 0) continue;
  configs.push({
    input: `exports/${file}`,
    output: {
      exports: 'default',
      format: 'cjs',
      file: `exports/${name}.cjs`,
    },
  });
}
export default configs;
