var test = require('tape')
var mock = require('mock-fs')
var doiuse = require('../lib/doiuse')

test('info with browserslist file', function (t) {
  mock({
    'browserslist': 'Safari 8\nIE >= 11'
  })

  var actual = doiuse({}).info().browsers
  var expected = [['ie', '11'], ['safari', '8']]

  t.deepEqual(actual, expected)

  mock.restore()

  t.end()
})