
var through = require('through2'),
    duplexer = require('duplexer2'),
    rules = require('css-rule-stream');

var postcss = require('postcss'),
    doiuse = require('./');

module.exports = stream;

function stream(browsers) {
  var inp = rules();

  var processor = postcss(doiuse({
    browsers: browsers,
    onFeatureUsage: pushUsage
  }));

  var out = through.obj(function(rule, enc, next) {
    try {
      processor.process(rule.content);
      next();
    }
    catch(e) {
      next(e);
    }
  });
  
  function pushUsage(usage) {
    out.push(usage);
  }

  inp.pipe(out);
  return duplexer(inp, out);
}
