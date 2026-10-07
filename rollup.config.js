/* eslint-disable canonical/filename-match-exported */
import { readdirSync, readFileSync } from 'node:fs';

import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

// multimatch is ESM-only, which `require()` can't load on Node < 20.19/22.12,
// so inline it (and its dependencies) into the CJS builds. Everything else
// stays external.
const { dependencies } = JSON.parse(readFileSync('./package.json', 'utf8'));
const external = Object.keys(dependencies).filter((name) => name !== 'multimatch');
const isExternal = (/** @type {string} */ id) => id.startsWith('node:')
  || external.some((name) => id === name || id.startsWith(`${name}/`));

/** @type {import('rollup').RollupOptions[]} */
const configs = [];

/** @type {string[]} */
const files = readdirSync('./exports');
for (const file of files) {
  const [name, afterExtension, ...afterExtensionExtra] = file.split('.js');
  if (afterExtension !== '' || afterExtensionExtra.length > 0) continue;
  configs.push({
    input: `exports/${file}`,
    external: isExternal,
    plugins: [nodeResolve(), commonjs()],
    output: {
      exports: 'default',
      format: 'cjs',
      file: `exports/${name}.cjs`,
    },
  });
}
export default configs;
