import { test } from 'tap';
import { formatBrowserName } from '../utils/util.js';

test('works', (t) => {
  const cases = [
    {
      msg: 'consecutive integers',
      versions: ['8', '9', '10', '11'],
      expected: 'IE (8-11)',
    },
    {
      msg: 'multiple ranges',
      versions: ['8', '9', '11', '12', '17', '19'],
      expected: 'IE (8-9,11-12,17,19)',
    },
    {
      msg: 'minor version',
      versions: ['8', '9', '9.1', '10', '11'],
      expected: 'IE (8-9,9.1,10-11)',
    },
    {
      msg: 'non numerical version',
      versions: ['8', '9', '9-beta', '10', '11'],
      expected: 'IE (8-9,9-beta,10-11)',
    },
  ];

  for (const caseItem of cases) {
    const actual = formatBrowserName('ie', caseItem.versions);
    t.same(actual, caseItem.expected, caseItem.msg);
  }
  t.end();
});
