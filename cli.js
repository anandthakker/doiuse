#!/usr/bin/env node

const FILE_NOT_FOUND = 'ENOENT'

const fs = require('fs')
const ldjson = require('ldjson-stream')
const through = require('through2')
const browserslist = require('browserslist')
const path = require('path')

const formatBrowserName = require('./lib/util').formatBrowserName
const doiuse = require('./stream')

const yargs = require('yargs')
  .usage('Lint your CSS for browser support.')
  .example('cat FILE | $0 -b "ios >= 6"', '')
  .example('$0 --browsers "ie >= 9, > 1%, last 3 versions" [FILE] [FILE] ...', '')
  .example('$0 -b "ie >= 8" -b "> 1%" -b "last 3 versions" [FILE] [FILE] ...', '')
  .options('b', {
    alias: 'browsers',
    description: 'Autoprefixer-like browser criteria.',
    default: null
  })
  .string('b')
  .options('i', {
    alias: 'ignore',
    description: 'List of features to ignore.',
    default: ''
  })
  .string('i')
  .options('l', {
    alias: 'list-only',
    description: 'Just show the browsers and features that would be tested by' +
      'the specified browser criteria, without actually processing any CSS.'
  })
  .options('c', {
    alias: 'config',
    description: 'Provide options through config file'
  })
  .string('verbose')
  .options('v', {
    alias: 'verbose',
    description: 'Verbose output. Multiple levels available.'
  })
  .count('verbose')
  .options('j', {
    alias: 'json',
    description: 'Output JSON instead of string linter-like messages.'
  })
  .boolean('j')
  .help('h', 'Show help message.')
  .alias('h', 'help')

var argv = yargs.argv

// Config file reading
if (argv.config) {
  try {
    const fileData = fs.readFileSync(path.resolve(argv.config), 'utf8')
    const config = JSON.parse(fileData)

    Object.keys(config).forEach(key => {
      var value = config[key]

      if (key === 'browsers') {
        if (value instanceof Array) value = value.join(',')
      }

      argv[key] = value
    })
  } catch (err) {
    if (err.code === FILE_NOT_FOUND) console.error('Config file not found', err)
    else console.error(err)
  }
}

argv.browsers && (argv.browsers = argv.browsers.split(',').map(function (s) { return s.trim() }))
argv.ignore = argv.ignore.split(',').map(function (s) { return s.trim() })

// Informational output
if (argv.l) { argv.v = ++argv.verbose }
if (argv.verbose >= 1) {
  var browsers = browserslist(argv.browsers)
    .map(function (b) {
      b = b.split(' ')
      b[0] = formatBrowserName(b[0])
      b[1] = parseInt(b[1], 10)
      return b
    })
    .sort(function (a, b) { return (a[0] !== b[0]) ? a[0] > b[0] : a[1] > b[1] })
    .map(function (b) { return b.join(' ') })
    .join(', ')
  console.log('[doiuse] Browsers: ' + browsers)
}

var out
if (argv.verbose >= 2) {
  var features = require('./')(argv.browsers).info().features
  console.log('\n[doiuse] Unsupported features:')
  for (var feat in features) {
    out = [features[feat].caniuseData.title]
    if (argv.verbose >= 3) {
      out.push('\n', features[feat].missing.join(', '), '\n')
    }
    console.log(out.join(''))
  }
}
if (argv.l) { process.exit() }

// Process the CSS
if (argv.help || (argv._.length === 0 && process.stdin.isTTY)) {
  yargs.showHelp()
  process.exit()
}

if (argv.json) {
  out = ldjson.serialize()
}
if (!argv.json) {
  out = through.obj(function (usage, enc, next) {
    next(null, usage.message + '\n')
  })
}
out.pipe(process.stdout)

if (argv._.length > 0) {
  argv._.forEach(function (file) {
    fs.createReadStream(file)
      .pipe(doiuse({ browsers: argv.browsers, ignore: argv.ignore }, file))
      .on('error', function (err) { console.error(err) })
      .pipe(out)
  })
} else {
  process.stdin
    .pipe(doiuse({ browsers: argv.browsers, ignore: argv.ignore }))
    .on('error', function (err) { console.error(err) })
    .pipe(out)
}
