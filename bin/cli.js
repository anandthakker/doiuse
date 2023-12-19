#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { PassThrough } from 'node:stream';

import browserslist from 'browserslist';
import ldjson from 'ldjson-stream';
import yargs from 'yargs';

import DoIUse from '../lib/DoIUse.js';
import CssUsageDuplex from '../lib/stream/CssUsageDuplex.js';
import { formatBrowserName } from '../utils/util.js';

const FILE_NOT_FOUND = 'ENOENT';
const argv = await yargs(process.argv.slice(2))
  .usage('Lint your CSS for browser support.')
  .example('cat FILE | $0 -b "ios >= 6"', '')
  .example('$0 --browsers "ie >= 9, > 1%, last 3 versions" [FILE] [FILE] ...', '')
  .example('$0 -b "ie >= 8" -b "> 1%" -b "last 3 versions" [FILE] [FILE] ...', '')
  .options({
    browsers: {
      type: 'string',
      alias: 'b',
      description: 'Autoprefixer-like browser criteria.',
      default: /** @type {string} */ (null),
      string: true,
    },
    ignore: {
      type: 'string',
      alias: 'i',
      description: 'List of features to ignore.',
      default: '',
      string: true,
    },
    l: {
      type: 'boolean',
      alias: 'list-only',
      description: 'Just show the browsers and features that would be tested by'
      + 'the specified browser criteria, without actually processing any CSS.',
    },
    config: {
      type: 'string',
      alias: 'c',
      description: 'Provide options through config file',
    },
    verbose: {
      type: 'number',
      alias: 'v',
      description: 'Verbose output. Multiple levels available.',
    },
    json: {
      type: 'boolean',
      alias: 'j',
      description: 'Output JSON instead of string linter-like messages.',
    },
  })
  .count('verbose')
  .help('h', 'Show help message.')
  .alias('h', 'help')
  .argv;

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
  } catch (error) {
    if (error && error.code === FILE_NOT_FOUND) {
      process.stderr.write('Config file not found\n');
    }
    throw error;
  }
}

const browsers = argv.browsers ? argv.browsers.split(',')
  .map((/** @type {string} */ s) => s.trim()) : null;

const ignore = argv.ignore.split(',').map((s) => s.trim());

// Informational output
if (argv.l || argv.verbose >= 1) {
  const formattedBrowsers = browserslist(browsers)
    .map((b) => {
      const [name, version] = b.split(' ');
      /** @type {[string, number]} */
      const formatted = [formatBrowserName(name), Number.parseInt(version, 10)];
      return formatted;
    })
    .sort((a, b) => b[1] - a[1])
    .map((b) => b.join(' '))
    .join(', ');
  process.stdout.write(`[doiuse] Browsers: ${formattedBrowsers}\n`);
}

if (argv.verbose >= 2) {
  const { features } = new DoIUse({ browsers }).info();
  process.stdout.write('[doiuse] Unsupported features:\n');
  for (const feature of Object.values(features)) {
    process.stdout.write(`${feature.caniuseData.title}\n`);
    if (argv.verbose >= 3) {
      process.stdout.write(`\n${feature.missing}\n`);
    }
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
  process.exit(0);
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
  stream.pipe(new CssUsageDuplex({
    browsers: argv.browsers,
    // @ts-expect-error Skip cast
    ignore,
  }, file))
    .on('error', (error) => {
      process.stderr.write('Error parsing file\n');
      throw error;
    })
    .pipe(outStream);
}
if (argv._.length > 0) {
  for (const file of argv._) {
    processStream(fs.createReadStream(file.toString()), file.toString());
  }
} else {
  processStream(process.stdin);
}
