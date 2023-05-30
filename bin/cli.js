#!/usr/bin/env node

/* eslint-disable no-console */

import fs from 'fs';
import path from 'path';
import { PassThrough } from 'stream';

import browserslist from 'browserslist';
import ldjson from 'ldjson-stream';
import yargsImport from 'yargs';

import DoIUse from '../lib/DoIUse.js';
import CssUsageDuplex from '../lib/stream/CssUsageDuplex.js';
import { formatBrowserName } from '../utils/util.js';

const FILE_NOT_FOUND = 'ENOENT';
const yargs = yargsImport(process.argv.slice(2));

yargs
  .usage('Lint your CSS for browser support.')
  .example('cat FILE | $0 -b "ios >= 6"', '')
  .example('$0 --browsers "ie >= 9, > 1%, last 3 versions" [FILE] [FILE] ...', '')
  .example('$0 -b "ie >= 8" -b "> 1%" -b "last 3 versions" [FILE] [FILE] ...', '')
  .options('b', {
    alias: 'browsers',
    description: 'Autoprefixer-like browser criteria.',
    default: null,
  })
  .string('b')
  .options('i', {
    alias: 'ignore',
    description: 'List of features to ignore.',
    default: '',
  })
  .string('i')
  .options('l', {
    alias: 'list-only',
    description: 'Just show the browsers and features that would be tested by'
      + 'the specified browser criteria, without actually processing any CSS.',
  })
  .options('c', {
    alias: 'config',
    description: 'Provide options through config file',
  })
  .string('verbose')
  .options('v', {
    alias: 'verbose',
    description: 'Verbose output. Multiple levels available.',
  })
  .count('verbose')
  .options('j', {
    alias: 'json',
    description: 'Output JSON instead of string linter-like messages.',
  })
  .boolean('j')
  .help('h', 'Show help message.')
  .alias('h', 'help');

/** @type {Record<string,any>} */
const { argv } = yargs;

// Config file reading
if (argv.config) {
  try {
    const fileData = fs.readFileSync(path.resolve(argv.config));
    const config = JSON.parse(fileData.toString());

    for (const [key, value] of Object.entries(config)) {
      argv[key] = (key === 'browsers' && Array.isArray(value))
        ? value.join(',')
        : value;
    }
  } catch (err) {
    if (err && err.code === FILE_NOT_FOUND) {
      console.error('Config file not found', err);
    } else {
      console.error(err);
    }
  }
}

if (argv.browsers) {
  argv.browsers = argv.browsers.split(',')
    .map((s) => s.trim());
}
argv.ignore = argv.ignore.split(',').map((s) => s.trim());

// Informational output
if (argv.l) { argv.v = ++argv.verbose; }
if (argv.verbose >= 1) {
  const browsers = browserslist(argv.browsers)
    .map((b) => {
      const [name, version] = b.split(' ');
      /** @type {[string, number]} */
      const formatted = [formatBrowserName(name), Number.parseInt(version, 10)];
      return formatted;
    })
    .sort((a, b) => b[1] - a[1])
    .map((b) => b.join(' '))
    .join(', ');
  console.log(`[doiuse] Browsers: ${browsers}`);
}

if (argv.verbose >= 2) {
  const { features } = new DoIUse(argv.browsers).info();
  console.log('\n[doiuse] Unsupported features:');
  for (const feature of Object.values(features)) {
    const out = [feature.caniuseData.title];
    if (argv.verbose >= 3) {
      out.push('\n', feature.missing, '\n');
    }
    console.log(out.join(''));
  }
}

if (argv.l) {
  // eslint-disable-next-line n/no-process-exit
  process.exit(0);
}

// Process the CSS
if (argv.help || (argv._.length === 0 && process.stdin.isTTY)) {
  yargs.showHelp();
  // eslint-disable-next-line n/no-process-exit
  process.exit();
}

/** @type {import("stream").Writable} */
let outStream;
if (argv.json) {
  outStream = ldjson.serialize();
} else {
  outStream = new PassThrough({
    objectMode: true,
    transform(usage, enc, next) {
      next(null, `${usage.message}\n`);
    },
  });
}
outStream.pipe(process.stdout);

/**
 * @param {import('stream').Stream} stream
 * @param {string} [file]
 */
function processStream(stream, file) {
  stream.pipe(new CssUsageDuplex({ browsers: argv.browsers, ignore: argv.ignore }, file))
    .on('error', (err) => { console.error(err); })
    .pipe(outStream);
}
if (argv._.length > 0) {
  for (const file of argv._) {
    processStream(fs.createReadStream(file), file);
  }
} else {
  processStream(process.stdin);
}
