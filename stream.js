
var through = require('through2'),
    duplexer = require('duplexer2'),
    rules = require('css-rule-stream');

var postcss = require('postcss'),
    doiuse = require('./');

module.exports = stream;

function stream(browsers) {
  var inp = rules();
  var out = through.obj(function(rule, enc, next) {
    try {
      postcss(doiuse({
        browserSelection: browsers,
        onUnsupportedFeatureUse: this.push.bind(this)
      })).process(rule.content);
    }
    catch(e) {
      next(e);
    }
  });

  inp.pipe(out);
  return duplexer(inp, out);
}
