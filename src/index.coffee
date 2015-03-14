
_ = require('lodash')

missingSupport = require('./lib/missing-support')
Detector = require('./lib/detect-feature-use')
featureData = require('./data/features')
SourceMapConsumer = require('source-map').SourceMapConsumer

doiuse = ({browsers, onFeatureUsage}) ->
  browsers ?= doiuse.default.slice()
  cb = onFeatureUsage ? ->
  {browsers, features} = missingSupport(browsers)
  detector = new Detector(_.keys(features))

  info: ->
    browsers: browsers,
    features: features

  postcss: (css) ->
    detector.process css, ({feature, usage}) ->
      loc = usage.source
      loc.original = if css.prevMap?
        # https://github.com/postcss/postcss/blob/bfbf0c4d3239df96876f9d8331060acad619f0c5/lib/previous-map.js#L17
        start: css.prevMap.consumer().originalPositionFor(loc.start)
        end: css.prevMap.consumer().originalPositionFor(loc.end)
      else
        start: loc.start
        end: loc.end

      message= (loc.original.start.source ? loc.input.file ? loc.input.from) + ':' +
        loc.original.start.line + ':' + loc.original.start.column + ': ' +
        features[feature].title + ' not supported by: ' +
        features[feature].missing

      cb
        feature: feature
        featureData: features[feature]
        usage: usage
        message: message

doiuse.default = ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
module.exports = doiuse
