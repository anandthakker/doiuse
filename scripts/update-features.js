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

// for each feature, make sure that data/features/{feature}.js exists
// if not, create it.
const featureTemplate = await fs.readFile('scripts/feature.template.js', 'utf8');
await Promise.all(
  cssFeatures.map(async ([name]) => {
    const filepath = path.resolve(`data/features/${name}.js`);

    const fullTitle = unpackFeature(caniuse.features[name]).title;
    const link = fullDatabase.data[name]
      ? `https://caniuse.com/${name}`
      : `This feature comes from MDN: https://developer.mozilla.org/en-US/search?q=${fullTitle.replaceAll(' ', '+')}`;
    const description = fullDatabase.data[name]?.description
      // replace all non-standard whitespace with normal spaces
      ?.replaceAll(/\s/g, ' ')
      // and nbsp is a special case
      .replaceAll('\u00A0', ' ')
      .trim();

    const stub = featureTemplate
      .replace('FEATURE_NAME', fullTitle)
      .replace('FEATURE_LINK', link)
      .replace('FEATURE_DESCRIPTION', description ?? 'No description available.');

    try {
      await fs.access(filepath);
      const fileContent = await fs.readFile(filepath, 'utf8');

      // if the file is empty, add a TODO comment
      if (fileContent.trim() === '') {
        await fs.writeFile(
          filepath,
          stub,
        );
      }
    } catch {
      await fs.writeFile(
        filepath,
        stub,
      );
    }
  }),
);

// check every file in 'data/features' to make sure it's in the list of features
// if not, delete it
const notCSS = [];
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

        if (fileContent.includes(' * TODO: initially implement ')
        || fileContent.trim() === '') {
          await fs.unlink(`data/features/${filename}`);
        } else {
          console.warn(`\u001B[33mWARNING: ${filename}: ${title} isn't a CSS feature.${
            category ? ` It's tagged with ${category}.` : ''
          }\u001B[0m`);
          notCSS.push([filename.replace(/\.js$/, '')]);
        }
      }
    }),
);

const allFeatures = [...cssFeatures, ...notCSS];

// update the data/features.js file with all the features
const template = await fs.readFile('scripts/features.template.js', 'utf8');
const imports = allFeatures.map(([name]) => `import ${kebabToCamel(name)} from './features/${name}.js';`).join('\n');
const features = allFeatures.map(([name]) => `  '${name}': ${kebabToCamel(name)},`).join('\n');

const updatedTemplate = template
  .replace('/* IMPORTS_PLACEHOLDER */', imports)
  .replace('/* FEATURES_PLACEHOLDER */', features);

await fs.writeFile('data/features.js', updatedTemplate);

// create test stubs for each feature
const existingTests = await fs.readdir('test/cases/features');
const unimplementedTests = await fs.readdir('test/cases/unimplemented');
const allTests = new Set([...existingTests, ...unimplementedTests]);
const testTemplate = await fs.readFile('scripts/test.template.css', 'utf8');

await Promise.all(
  allFeatures.map(async ([name]) => {
    const filename = `${name}.css`;
    const pathToWrite = `test/cases/untriaged/${filename}`;

    if (!allTests.has(filename)) {
      const { title } = unpackFeature(caniuse.features[name]);
      const link = fullDatabase.data[name]
        ? `https://caniuse.com/${name}`
        : `This feature comes from MDN: https://developer.mozilla.org/en-US/search?q=${title.replaceAll(' ', '+')}`;
      const description = fullDatabase.data[name]?.description;

      const stub = testTemplate
        .replace('FEATURE_NAME', title)
        .replace('FEATURE_LINK', link)
        .replace('FEATURE_DESCRIPTION', description ?? '')
        .replace('FEATURE_ID', name);

      await fs.writeFile(
        pathToWrite,
        stub,
      );
    }
  }),
);

// Give warnings for test cases that don't have a feature
const noFeatures = [];
existingTests.forEach((filename) => {
  if (!filename.endsWith('.css')) return;
  const name = filename.replace(/\.css$/, '');
  const featureExists = cssFeatures.some(([id]) => id === name);
  if (!featureExists) {
    noFeatures.push(filename);
  }
});

if (noFeatures.length > 0) {
  console.warn("The following test cases don't have a corresponding feature:");
  console.warn(noFeatures.join(', '));
}
