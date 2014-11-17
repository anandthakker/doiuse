#!/usr/bin/env node

var fs = require('fs'),
    concat = require('concat-stream'),
    postcss = require('postcss');

var formatBrowserName = require('./dist/lib/util').formatBrowserName,
    doiuse = require('./');

var yargs = require('yargs')
  .usage('Lint your CSS for browser support.')
  .example('cat FILE | $0 -b "ios >= 6"', '')
  .example('$0 --browsers "ie >= 9, > 1%, last 3 versions" [FILE] [FILE] ...', '')
  .example('$0 -b "ie >= 8" -b "> 1%" -b "last 3 versions" [FILE] [FILE] ...', '')
  .options('b', {
    alias: 'browsers',
    description: 'Autoprefixer-like browser criteria.',
    default: doiuse.default.join(', ')
  })
  .string('b')
  .options('l', {
    alias: 'list-only',
    description: 'Just show the browsers and features that would be tested by' +
      'the specified browser crtieria, without actually processing any CSS.'
  })
  .options('v', {
    alias: 'verbose',
    description: 'Verbose output. Multiple levels available.'
  })
  .count('verbose')
  .help('h', 'Show help message.')
  .alias('h', 'help');
  
var argv = yargs.argv;


var report = console.log.bind(console);
var linter = doiuse({
  browsers: argv.b.split(',').map(function(s){return s.trim();}),
  onUnsupportedFeatureUse: function(usageInfo) {
    report(usageInfo.message);
  }
});
var processor = postcss(linter);

// Informational output
if(argv.l) { argv.v = ++argv.verbose; }
if(argv.verbose >= 1) {
  browsers = linter.info().browsers
  console.log('[doiuse] Browsers: ' + browsers.map(function(b) {
    b[0] = formatBrowserName(b[0])
    return b.join(' ')
  }).join(', '));
}

if(argv.verbose >= 2) {
  features = linter.info().features;
  console.log('\n[doiuse] Unsupported features:');
  for(feat in features) {
    var out = [features[feat].caniuseData.title];
    if(argv.verbose >= 3) {
      out.push('\n', features[feat].missing.join(', '), '\n');
    }
    console.log(out.join(''))
  }
}
if(argv.l) { process.exit(); }


// Process the CSS
if(argv.help || (argv._.length == 0 && process.stdin.isTTY)) {
  yargs.showHelp();
  process.exit();
}

if(argv._.length > 0)
  argv._.forEach(function(file){
    processor.process(fs.readFileSync(file), {
      from: file
    });
  });
else
  process.stdin.pipe(concat(function(css) {
    processor.process(css);
  }));
