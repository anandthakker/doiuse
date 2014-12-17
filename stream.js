
var through = require('through2'),
    duplexer = require('duplexer2'),
    concat = require('concat-stream');

var postcss = require('postcss'),
    doiuse = require('./');

module.exports = stream;

function stream(browsers, options) {
  var inp = concat({encoding: 'string'}, function(css) {
    postcss(doiuse({
      browserSelection: browsers,
      onUnsupportedFeatureUse: writeUsage
    })).process(css);
    out.end();
  });
  var out = through.obj();
  function writeUsage(usageInfo) {
    out.write(options.json ? JSON.stringify(usageInfo) : usageInfo.message);
  }
  return duplexer(inp, out);
}
