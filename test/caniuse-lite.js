import { readdirSync } from 'fs';
import { dirname, join as joinPath } from 'path';
import { fileURLToPath } from 'url';

import * as caniuse from 'caniuse-lite';
import { test } from 'tap';

import FEATURES from '../data/features.js';

const selfPath = dirname(fileURLToPath(import.meta.url));

const files = readdirSync(joinPath(selfPath, '../data/features/'))
  .filter((f) => f.endsWith('.js'))
  .sort();

const dbFeatures = Object.keys(caniuse.features).sort();

test('each feature has entry', (t) => {
  t.same(dbFeatures.map((f) => `${f}.js`).sort(), files);
  t.end();
});

test('each implementation has entry', async (t) => {
  const fileModules = await Promise.all(files.map(async (file) => [file, await import(`../data/features/${file}`)]));
  const nonNullExports = fileModules
    .filter(([, module]) => (module.default != null))
    .map(([file]) => file.slice(0, -3))
    .sort();
  t.same(nonNullExports, Object.keys(FEATURES).sort());
  t.end();
});
