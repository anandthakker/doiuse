
var through = require('through2'),
    duplexer = require('duplexer2'),
    rules = require('css-rule-stream'),
    sourcemap = require('source-map');

var postcss = require('postcss'),
    doiuse = require('./');

module.exports = stream;

/**
 * @param {Array<string>} browsers  the browserslist browser selection
 * @param {string} [filename]  Filename for outputting source code locations. 
 */
function stream(browsers, filename) {
  var inp = rules();
  filename = filename || '<streaming css input>'

  var processor = postcss(doiuse({
    browsers: browsers,
    onFeatureUsage: pushUsage
  }));

  var out = through.obj(function(rule, enc, next) {
    try {
      var mapper = new sourcemap.SourceMapGenerator();
      
      var lines = rule.content.split('\n');
      var oline = rule.line, ocol = rule.column;
      for(var line = 0; line < lines.length; line++) {
        mapper.addMapping({
          generated: { line: line + 1, column: 1 },
          original: { line: oline, column: ocol },
          source: filename
        })
        mapper.addMapping({
          generated: { line: line + 1, column: lines[line].length },
          original: {line: oline, column: ocol + lines[line].length },
          source: filename
        })
        oline++;
        ocol = 1;
      }
      
      processor.process(rule.content, {map: {prev: mapper.toString() } });
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
