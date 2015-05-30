var fs = require('fs')
var test = require('tape')
var doiuse = require('../dist')
var postcss = require('postcss')
var hasKeys = require('./has-keys')

test('leaves css alone by default', function (t) {
  var css, out
  css = fs.readFileSync(require.resolve('./cases/gradient.css')).toString()
  out = postcss(doiuse({
    browsers: [
      'ie >= 7',
      'safari >= 6',
      'opera >= 10.1'
    ]
  })).process(css).css
  t.equal(out, css)
  t.end()
})

test('calls back for unsupported feature usages', function (t) {
  var count, css
  css = fs.readFileSync(require.resolve('./cases/gradient.css'))
  count = 0
  postcss(doiuse({
    browsers: ['ie 8'],
    onFeatureUsage: function (usageInfo) {
      count++
      hasKeys(t, usageInfo, ['feature', 'featureData', 'usage', 'message'])
      hasKeys(t, usageInfo.featureData, ['title', 'missing', 'missingData', 'caniuseData'])
    }
  }))
  .process(css).then(function () {
    t.equal(count, 4)
    t.end()
  })
})
