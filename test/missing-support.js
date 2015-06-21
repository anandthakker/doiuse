var test = require('tape')
var missingSupport = require('../lib/missing-support')
var hasKeys = require('./has-keys')

test('provides list of selected browsers', function (t) {
  var data
  data = missingSupport(['ie >= 8'])
    .browsers.sort(function (a, b) {
    return Number(a[1]) - Number(b[1])
  })
  t.deepEqual(data, [
    [
      'ie',
      '8'
    ],
    [
      'ie',
      '9'
    ],
    [
      'ie',
      '10'
    ],
    [
      'ie',
      '11'
    ]
  ])

  t.end()
})

test('for browser request ie >= 7, safari >= 6, opera >= 10.1', function (t) {
  var data = missingSupport([
    'ie >= 7',
    'safari >= 6'
  ]).features

  var bgimgopts = data['background-img-opts']
  hasKeys(t, bgimgopts, ['missing', 'title', 'missingData', 'caniuseData'])

  var missing = bgimgopts.missingData
  hasKeys(t, missing, ['ie', 'safari'])
  hasKeys(t, missing.ie, ['7', '8'])
  hasKeys(t, missing.safari, ['6', '6.1'])
  t.end()
})

test('only yields features not supported by selected browser', function (t) {
  var data, f, featureData
  data = missingSupport(['ie 8']).features
  for (f in data) {
    featureData = data[f]
    hasKeys(t, featureData.missingData, ['ie'])
  }
  t.end()
})
