#!/usr/bin/env node

var fs = require('fs'),
    concat = require('concat-stream'),
    postcss = require('postcss');

var doiuse = require('./');

var yargs = require('yargs')
  .usage('Lint your CSS for browser support.')
  .options('b', {
    alias: 'browsers',
    description: 'Autoprefixer-like browser criteria.',
    default: doiuse.default.join(', ')
  })
  .string('b')
  .example('cat FILE | $0 -b "ios >= 6"', '')
  .example('$0 --browsers "ie >= 9, > 1%, last 3 versions" [FILE] [FILE] ...', '')
  .example('$0 -b "ie >= 8" -b "> 1%" -b "last 3 versions" [FILE] [FILE] ...', '')
  .help('h', 'Show help message.');

var argv = yargs.argv;

if(argv.h || (argv._.length == 0 && process.stdin.isTTY)) {
  yargs.showHelp();
  process.exit();
}

var report = console.log.bind(console);

var processor = postcss(doiuse({
  browsers: argv.b.split(',').map(function(s){return s.trim();}),
  onUnsupportedFeatureUse: function(usageInfo) {
    report(usageInfo.message);
  }
}));

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

// postcss(doiuse({
//   browsers:['ie >= 6', '> 1%'],
//   onUnsupportedFeatureUse: function(usageInfo) {
//     console.log(usageInfo.message);
//   }
// })).process("a { background-size: cover; }")
