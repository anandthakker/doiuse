
var through = require('through2'),
    duplexer = require('duplexer2'),
    concat = require('concat-stream');

var postcss = require('postcss'),
    doiuse = require('./');

module.exports = stream;

function stream(browsers) {
  var out = through.obj();
  var inp = concat({encoding: 'string'}, function(css) {
    try {
      postcss(doiuse({
        browserSelection: browsers,
        onUnsupportedFeatureUse: out.write.bind(out)
      })).process(css);
    }
    catch(e) {
      out.write({"message": "error parsing CSS", "error": e});
    }
    finally {
      out.end();
    }
  });
  return duplexer(inp, out);
}
