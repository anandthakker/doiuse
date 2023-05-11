// file: mymodule.js

import fs from 'fs/promises';
import path from 'path';

import caniuse, { feature as unpackFeature } from 'caniuse-lite';

import { kebabToCamel } from '../utils/kebabToCamel.js';

const dataPath = path.resolve('node_modules/caniuse-db/data.json');
const json = await fs.readFile(dataPath, 'utf8');
const fullDatabase = JSON.parse(json);

// from caniuse-lite, get a list of all features that either
// A) have a css category
// C) have CSS in the id
// D) have 'text-decoration' or 'stylesheet' in the id (mdn stuff)
const cssFeatures = Object.entries(caniuse.features)
  .map(([id, packed]) => [id, unpackFeature(packed)])
  .filter(([id]) => fullDatabase.data[id]?.categories.includes('CSS')
    || fullDatabase.data[id]?.categories.includes('CSS2')
    || fullDatabase.data[id]?.categories.includes('CSS3')
    || id.toLowerCase().includes('css')
    || id.toLowerCase().includes('text-decoration')
    || id.toLowerCase().includes('stylesheet'));

// log the name of each feature
// cssFeatures.forEach(([id]) => console.log(`CSS: ${id}`));

// for each feature, make sure that data/features/{feature}.js exists
// if not, create it.
await Promise.all(
  cssFeatures.map(async ([name]) => {
    const filepath = path.resolve(`data/features/${name}.js`);

    const fileContent = await fs.readFile(filepath, 'utf8');

    // if the file is empty, add a TODO comment
    if (fileContent.trim() === '') {
      await fs.writeFile(
        filepath,
        `// TODO: implement ${name} feature\nexport default {};\n`,
      );
    }

    try {
      await fs.access(filepath);
    } catch {
      await fs.writeFile(
        filepath,
        `// TODO: implement ${name} feature\nexport default {};\n`,
      );
    }
  }),
);

// check every file in 'data/features' to make sure it's in the list of features
// if not, delete it
const dir = await fs.readdir('data/features');
await Promise.all(
  dir
    .map(async (filename) => {
      const name = filename.replace(/\.js$/, '');
      const featureExists = cssFeatures.some(([id]) => id === name);
      if (!featureExists) {
        // make sure the file is empty or only contains a TODO comment
        const filepath = path.resolve(`data/features/${filename}`);
        const fileContent = await fs.readFile(filepath, 'utf8');

        const { title } = unpackFeature(caniuse.features[name]);
        const category = fullDatabase.data[name]?.categories.join(', ');

        if (fileContent.includes('// TODO: implement')
        || fileContent.trim() === '') {
          await fs.unlink(`data/features/${filename}`);
        } else {
          console.warn(`\u001B[33mWARNING: ${filename}: ${title} isn't a CSS feature.${
            category ? ` It's tagged with ${category}.` : ''
          }\u001B[0m`);
        }
      }
    }),
);

// update the data/features.js file with all the features
const template = await fs.readFile('scripts/features.template.js', 'utf8');
const imports = cssFeatures.map(([name]) => `import ${kebabToCamel(name)} from './features/${name}.js';`).join('\n');
const features = cssFeatures.map(([name]) => `  '${name}': ${kebabToCamel(name)},`).join('\n');

const updatedTemplate = template
  .replace('/* IMPORTS_PLACEHOLDER */', imports)
  .replace('/* FEATURES_PLACEHOLDER */', features);

await fs.writeFile('data/features.js', updatedTemplate);
