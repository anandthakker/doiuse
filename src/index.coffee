
_ = require('lodash')

missingSupport = require('./lib/missing-support')
Detector = require('./lib/detect-feature-use')
featureData = require('./data/features')

doiuse = ({browserSelection, onUnsupportedFeatureUse}) ->
  browserSelection ?= doiuse.default.slice()
  cb = onUnsupportedFeatureUse ? ->
  {browsers, features} = missingSupport(browserSelection)
  detector = new Detector(_.keys(features))
  
  info: ->
    browsers: browsers,
    features: features

  postcss: (css) -> detector.process css, ({feature, usage})->
    loc = usage.source
    message= (loc.file ? loc.id) + ':' +
      ' line ' + loc.start.line + ', col ' + loc.start.column +
      " - " + features[feature].title + ' not supported by: ' +
      features[feature].missing

    cb
      feature: feature
      featureData: features[feature]
      usage: usage
      message: message

doiuse.default = ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
module.exports = doiuse
