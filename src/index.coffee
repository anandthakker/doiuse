
_ = require('lodash')

missingSupport = require('./lib/missing-support')
Detector = require('./lib/detect-feature-use')
featureData = require('./data/features')

agents = require('caniuse-db/data').agents

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
    browsers = _.reduce(features[feature].missing, (res, versions, browser)->
      browserName = agents[browser]?.browser
      res.push(browserName + ' (' + _.keys(versions).join(',') + ')')
      res
    , []).join(',')
    loc = usage.source
    message= (loc.file ? loc.id) + ':' +
      ' line ' + loc.start.line + ', col ' + loc.start.column +
      " - " + features[feature].caniuseData.title + ' not supported by: ' +
      browsers

    cb
      feature: feature
      featureData: features[feature]
      usage: usage
      message: message

doiuse.default = ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
module.exports = doiuse
