# Changelog

## 6.0.1 (2023-07-05)
* fix(DoIUse): support string constructor argument ab7df2f095637fe52d10d65eabe47facd5cd3633
* typescript: reconfigure for ts 5.x and node v16.x 44359cba909e1c6a6fb605b24ba71732ba3dda94 Use Typescript 5.x types
* fix(exports/stream): constructor as default export 959d763da9e465fd2dc73e7a36c093156fa47564

## 6.0.0 (2023-07-03)
* BREAKING: Drop Node v12 and v14 support
* Add caniuse features
* * `css-conic-gradients`
* * `css-container-queries-style`
* * `css-container-query-units`
* * `css-font-palette`
* * `css-grid-animation`
* * `css-matches-pseudo`
* * `css-math-functions`
* * `css-media-range-syntax`
* * `css-motion-paths`
* * `css-print-color-adjust`
* * `mdn-css-unicode-bidi-isolate`
* * `mdn-css-unicode-bidi-isolate-override`
* * `mdn-css-unicode-bidi-plaintext`
* * `mdn-text-decoration-color`
* * `mdn-text-decoration-line`
* * `mdn-text-decoration-shorthand`
* * `mdn-text-decoration-style`
* Update dependencies
* * browserlist 
* * caniuse-lite
* * postcss
* * source-map
* * yargs
* Update dev dependencies

## 5.1.1 (2022-03-12)
* Fix flexbox typo

## 5.1.0 (2022-03-12)
* Add legacy support with `main` in package.json
* Use individual files for feature checks
* Add missing css-grid values

## 5.0.4 (2022-03-12)
* Fixed CommonJS support
* Replaced `esbuild` to `rollup` for CommonJS support

## 5.0.3 (2022-03-07)
* Fixed extra errors being emitted
* Add `types/**/*.d.ts`

## 5.0.2 (2022-03-07)
* Fixed CommonJS support

## 5.0.1 (2022-03-07)
* Fixed Node v12 support

## 5.0.0 (2022-03-07)
* Rewrite all files to ES Modules
* Fold `css-rule-stream` into package
* Drop support for Node v10
* Drop `tape` for `tap`
* Drop `through2` for native `Passthrough`
* Remove `babel`
* Add coverage (`c8`)
* Add `eslint` rules

## 4.4.1 (2021-01-26)

* Intrinsic width feature update with "stretch" value [\#132](https://github.com/anandthakker/doiuse/pull/132)
* Drop unused jsonfilter dependency [\#133](https://github.com/anandthakker/doiuse/pull/133)
* Upgrade browserslist (4.16.1), caniuse-lite (1.0.30001157), postcess (8.1.6), yargs (16.2.0) [\#134](https://github.com/anandthakker/doiuse/pull/134)

## 4.4.0 (2020-11-10)

* Fix possible regular expression catastrophic backtracking [\#105](https://github.com/anandthakker/doiuse/pull/105)
* Upgrade browserslist (4.14.7), caniuse-lite (1.0.30001179), postcess (8.2.4) [\#106](https://github.com/anandthakker/doiuse/pull/106)

## 4.3.1 (2020-10-30)

* Optimize package size by ignoring .idea and .github folders

## 4.3.0 (2020-10-30)

**IMPORTANT**: This release drops support for Node older than 10.x

* Upgrade dependencies and remove security warnings [\#123](https://github.com/anandthakker/doiuse/pull/123)
* Extend list of tested Node.js versions [\#122](https://github.com/anandthakker/doiuse/pull/122)
* Migrate CI to GitHub Actions [\#122](https://github.com/anandthakker/doiuse/pull/122)

## 4.2.0 (2018-09-27)

* Detect use of 'initial', 'unset', and 'revert' keywords [\#93](https://github.com/anandthakker/doiuse/pull/93)
* Improve css-sel2 detection performance [\#88](https://github.com/anandthakker/doiuse/pull/88)
* Remove lodash dependency [\#94](https://github.com/anandthakker/doiuse/pull/94)
* Upgrade browserslist (4.1.1), caniuse-lite (1.0.30000887)

## 4.1.0 (2018-03-23)

* Upgrade browserslist (3.1.1) and caniuse-lite (1.0.30000810) [\#85](https://github.com/anandthakker/doiuse/pull/85)
* Update font-unicode-range [\#80](https://github.com/anandthakker/doiuse/pull/80)
* Conform to browserslist API [\#81](https://github.com/anandthakker/doiuse/pull/81)
* Upgrade browserslist (3.2.1) and caniuse-lite (1.0.30000819)
* Drop node 4 support

## 4.0.0 (2017-10-09)

* **Breaking:** No longer throws an error for unrecognised node types [\#75](https://github.com/anandthakker/doiuse/pull/75)

## 3.0.1 (2017-08-24)

* Fix config not found due to missing parameter

## 3.0.0 (2017-05-15)

* Remove Node.js 0.12 support
* Use PostCSS 6
* Use Browserslist 2
* Use caniuse-lite instead of caniuse-db
* Fix loading Browserslist config
* Clean npm package from development files

## 2.0.2 (2015-10-16)

* Use PostCSS 'warn' API, add feature id in reported results

## 2.0.1 (2015-10-13)

* **Breaking:** Add option to ignore rules
* clean up README, add Gulp example
* update node versions on travis

## 1.0.4 (2015-10-07)
* update PostCSS to 5.x

## 1.0.3 (2015-07-28)
* update browserlist dep

## 1.0.2 (2015-07-21)
* strip URLs out of values before testing them
* add standard code style, fix lint errors
* fix lint errors
* add failing test for [\#17](https://github.com/anandthakker/doiuse/pull/17)
* link to openopensource.org

## 1.0.1 (2015-06-01)
* update caniuse-db
* update / fix README examples.

## 0.3.3 (2015-05-03)
* update postcss version
* fix test

## 0.3.2 (2015-02-11)
* add missing through2 dependency [\#6](https://github.com/anandthakker/doiuse/issues/6)

## 0.3.1 (2014-12-24)
* fix regression: correct source location in output
* add test for streaming mode, mostly to see wtf is happening on travis
* fix some cli tests

## 0.2.6 (2014-12-22)
* fix missing next()
* fix tests

## 0.2.4 (2014-12-21)
* don't instance postcss each chunk

## 0.2.3 (2014-12-21)
* cut the input CSS into a stream of (parseable) fragments.
* logging for travis
* drop nyan reporter

## 0.2.2 (2014-12-17)
* handle errors

## 0.2.1 (2014-12-17)
* fix: cli bugz
* change stream api to just do objects
* fix: flush stream

## 0.1.6 (2014-12-17)
* add transform stream option

## 0.1.5 (2014-12-17)
* use browserslist module
* add JSON output option in CLI

## 0.1.4 (2014-12-09)
* add several features (still pending tests)
* travis badge
* gulp-util dependency

## 0.1.3 (2014-12-08)
* feature: css3 cursors
* feature: outline
* feature: viewport units
* feature: word-break
* feature: css-repeating-gradients
* feature: css-resize
* features: rem units, pointer-events, counters
* add travis

## 0.1.2 (2014-12-08)
* switch to GNU message format.

## 0.1.1 (2014-11-23)
* feature: object-fit
* feature: overflow-wrap
* feature: text-overflow
* feature: opacity
* features: media queries and feature queries
* feature: css-canvas
* add feature: multibackgrounds

## 0.0.6 (2014-11-17)
* add bin to package.json
* include title directly in result for convenience
* bugfix: was failing to filter only unsupported features
* bugfix: cli was ignoring parameter
* add failing test for bug
* add informational output to cli
* CLI
* add info() method.
* build: clean task

## 0.0.5 (2014-11-17)
* add readable message to callback parameter

## 0.0.4 (2014-11-17)
* tweak regexp; add background-img-opts test
* convenience 'only' flag in test cases
* generalize feature detection testing
* detect-feature-use: smarter regexes
* feature: css-sel2 and css-sel3
* add some detection data
* stubs for features needing detection data

## 0.0.3 (2014-11-14)
* more documentation
* documentation
* fix missing-support test; reformat features data
* udpate readme

## 0.0.1 (2014-11-14)
* basic postcss plugin working.
* tweak build
* detect features being used in css file
* convert/filter caniuse data based on browser selection
* move output
* fix typo
* update build
* add data; gulpfile
* initial commit
