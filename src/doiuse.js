const multimatch = require('multimatch')

const missingSupport = require('./missing-support')
const Detector = require('./detect-feature-use')

function doiuse (options) {
  const { browsers: browserQuery, onFeatureUsage, ignore: ignoreOptions, ignoreFiles } = options

  return {
    info (opts = {}) {
      const { browsers, features } = missingSupport(browserQuery, opts.from)

      return {
        browsers,
        features
      }
    },

    postcss (css, result) {
      let from
      if (css.source && css.source.input) {
        from = css.source.input.file
      }

      let { features } = missingSupport(browserQuery, from)
      let detector = new Detector(Object.keys(features))

      return detector.process(css, function ({ feature, usage, ignore }) {
        if (ignore && ignore.indexOf(feature) !== -1) {
          return
        }

        if (ignoreOptions && ignoreOptions.indexOf(feature) !== -1) {
          return
        }

        if (ignoreFiles && multimatch(usage.source.input.from, ignoreFiles).length > 0) {
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

        if (!onFeatureUsage) {
          result.warn(message, { node: usage, plugin: 'doiuse' })
        } else {
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

module.exports = doiuse
