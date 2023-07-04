import postcss from 'postcss';
import { test } from 'tap';

import DoIUse from '../../lib/DoIUse.js';

test('partial support flags unsupported key: value pairs', async (t) => {
  const css = '.test {appearance: auto; }';
  let featureCount = 0;

  await postcss(new DoIUse({
    browsers: ['chrome 81'],
    onFeatureUsage: (usageinfo) => {
      const messageWithoutFile = usageinfo.message.replace(/<.*>/, '');
      t.equal(messageWithoutFile, ':1:8: CSS Appearance value of auto is not supported by: Chrome (81) (css-appearance)');
      featureCount += 1;
    },
  })).process(css);

  // make sure onFeatureUsage was called
  t.equal(featureCount, 1);
});

test('partial support does not flag supported key: value pairs', async (t) => {
  const css = '.test { appearance: none; }';
  let featureCount = 0;

  await postcss(new DoIUse({
    browsers: ['chrome 81'],
    onFeatureUsage: () => {
      featureCount += 1;
    },
  })).process(css);

  // make sure onFeatureUsage was not called
  t.equal(featureCount, 0);
});

test('partial support does not flag formerly unsupported key: value pairs', async (t) => {
  const css = '.test { appearance: auto; }';
  let featureCount = 0;

  await postcss(new DoIUse({
    browsers: ['chrome 83'],
    onFeatureUsage: () => {
      featureCount += 1;
    },
  })).process(css);

  // make sure onFeatureUsage was not called
  t.equal(featureCount, 0);
});

test('partial support messages with many versions are formatted correctly', async (t) => {
  const css = '.test {appearance: auto;}';
  let featureCount = 0;

  await postcss(new DoIUse({
    browsers: ['chrome > 70', 'firefox > 60'],
    onFeatureUsage: (usageinfo) => {
      const messageWithoutFile = usageinfo.message.replace(/<.*>/, '');
      t.equal(messageWithoutFile, ':1:8: CSS Appearance value of auto is not supported by: Chrome (81,80,79,78,77,76,75,74,73,72,71), Firefox (79,78,77,76,75,74,73,72,71,70,69,68,67,66,65,64,63,62,61) (css-appearance)');
      featureCount += 1;
    },
  })).process(css);

  // make sure onFeatureUsage was called
  t.equal(featureCount, 1);
});
