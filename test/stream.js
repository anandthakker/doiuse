
var stream = require('../stream'),
  through = require('through2');

require('chai').should();

describe('streaming', function() {
  
  var expected = [
    'css-sel3',
    'background-img-opts'
  ]
  
  it.only('works', function(done) {
    var s = stream('IE >= 8');
    s.pipe(through.obj(function(usage, enc, next) {
      usage.feature.should.equal(expected.shift());
      next();
    }, function(next) {
      next();
      expected.should.be.empty;
      done();
    }))
    
    s.end('div:nth-child(2n-1) { background-size: cover; }');
  })
  
})
