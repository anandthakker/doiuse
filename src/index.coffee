
_ = require('lodash')

missingSupport = require('./lib/missing-support')
Detector = require('./lib/detect-feature-use')
featureData = require('./data/features')

###
Usage: `postcss(doiuse(opts))`.

`opts`:
  - `browsers`: an autoprefixer-like array of browsers.
  - `onUnsupportedFeatureUse`: `function(usageInfo)`
    `usageInfo` looks like this:
    ```
    {
      feature: 'css-gradients', //slug identifying a caniuse-db feature
      featureData:{
        missing: {
          // subset of selected browsers that are missing support for this
          // particular feature, mapped to the version and (lack of)support code
          ie: { '8': 'n' }
        },
        caniuseData: { // data from caniuse-db/features-json/[feature].json }
      },
      usage: //the postcss node where that feature is being used.
    }
    Called once for each usage of each css feature not supported by the selected
    browsers.
###
doiuse = ({browserSelection, onUnsupportedFeatureUse}) ->
  browserSelection ?= doiuse.default.slice()
  cb = onUnsupportedFeatureUse ? ->
  {browsers, features} = missingSupport(browserSelection)
  detector = new Detector(_.keys(features))

  info: ->
    browsers: browsers,
    features: _.keys(features).map (f)->featureData[f]
  postcss: (css) -> detector.process css, ({feature, usage})->
    versions = features[feature].missing
    browsers = []
    for browser in versions
      browsers.push(
        browser + ' (' + _.keys(versions[browser]).join(',') + ')'
      );
    loc = usage.source
    message= loc.id + ' line ' + loc.start.line + " : " +
      feature + ' not supported by ' + browsers.join(',')

    cb
      feature: feature
      featureData: features[feature]
      usage: usage
      message: message

doiuse.default = ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
module.exports = doiuse
