let fs = require('fs');
let path = require('path');
let _ = require('lodash')
let missingSupport = require('./missing-support')
let Detector = require('./detect-feature-use')
let Multimatch = require('multimatch')

function browserslist () {
  var dirs = path.resolve('.').split(path.sep)
  var config
  var content

  while (dirs.length) {
    config = dirs.concat(['browserslist']).join(path.sep)

    if (fs.existsSync(config) && fs.statSync(config).isFile()) {
      content = fs.readFileSync(config, { encoding: 'utf8' })

      return content.split(/\r?\n/).join(', ')
    }
  }
}

function doiuse (options) {
  let {browsers: browserQuery, onFeatureUsage, ignore: ignoreOptions, ignoreFiles} = options

  if (!browserQuery) {
    browserQuery = browserslist()

    if (!browserQuery) {
      browserQuery = doiuse['default'].slice()
    }
  }


  let {browsers, features} = missingSupport(browserQuery)
  let detector = new Detector(_.keys(features))

  return {
    info () {
      return {
        browsers: browsers,
        features: features
      }
    },

    postcss (css, result) {
      return detector.process(css, function ({feature, usage, ignore}) {
        if (ignore && ignore.indexOf(feature) !== -1) {
          return
        }
        if (ignoreOptions && ignoreOptions.indexOf(feature) !== -1) {
          return
        }

        if (ignoreFiles && Multimatch(usage.source.input.from, ignoreFiles).length > 0) {
          return
        }

        let messages = []
        if (features[feature].missing) {
          messages.push('not supported by: ' + features[feature].missing)
        }
        if (features[feature].partial) {
          messages.push('only partially supported by: ' + features[feature].partial)
        }

        let message = features[feature].title + ' ' + messages.join(' and ') + ' (' + feature + ')'

        result.warn(message, { node: usage, plugin: 'doiuse' })

        if (onFeatureUsage) {
          let loc = usage.source
          loc.original = css.source.input.map ? {
            start: css.source.input.map.consumer().originalPositionFor(loc.start),
            end: css.source.input.map.consumer().originalPositionFor(loc.end)
          } : {
            start: loc.start,
            end: loc.end
          }

          message = (loc.original.start.source || loc.input.file || loc.input.from) + ':' +
            loc.original.start.line + ':' + loc.original.start.column + ': ' + message

          onFeatureUsage({
            feature: feature,
            featureData: features[feature],
            usage: usage,
            message: message
          })
        }
      })
    }
  }
}
doiuse['default'] = [
  '> 1%',
  'last 2 versions',
  'Firefox ESR',
  'Opera 12.1'
]
module.exports = doiuse
