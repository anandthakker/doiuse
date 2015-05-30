var stream = require('../stream'),
  through = require('through2')

var test = require('tape')

var expected = [
  'css-sel3',
  'background-img-opts'
]

test('streaming works', function (t) {
  var s = stream('IE >= 8')
  s.pipe(through.obj(function (usage, enc, next) {
    t.equal(usage.feature, expected.shift())
    next()
  }, function (next) {
    next()
    t.equal(expected.length, 0)
    t.end()
  }))

  s.end('div:nth-child(2n-1) { background-size: cover; }')
})
