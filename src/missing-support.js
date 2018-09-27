const caniuse = require('caniuse-lite')

const features = require('../data/features')
const BrowserSelection = require('./browsers')
const formatBrowserName = require('./util').formatBrowserName

const filterStats = (browsers, stats) => Object.keys(stats)
  .reduce((result, browser) => {
    const versions = stats[browser]
    const feature = Object.keys(versions).reduce((feat, version) => {
      const support = versions[version]
      const selected = browsers.test(browser, version)

      if (selected) {
        // check if browser is NOT fully (i.e., don't have 'y' in their stats) supported
        if (!(/(^|\s)y($|\s)/.test(support))) {
          // when it's not partially supported ('a'), it's missing
          const type = (/(^|\s)a($|\s)/.test(support) ? 'partial' : 'missing')

          if (!feat[type]) {
            feat[type] = {}
          }

          feat[type][selected[1]] = support
        }
      }

      return feat
    }, { missing: {}, partial: {} })

    if (Object.keys(feature.missing).length !== 0) {
      result.missing[browser] = feature.missing
    }

    if (Object.keys(feature.partial).length !== 0) {
      result.partial[browser] = feature.partial
    }

    return result
  }, { missing: {}, partial: {} })

const lackingBrowsers = browserStats => Object.keys(browserStats)
  .map(browser => formatBrowserName(browser, Object.keys(browserStats[browser])))
  .join(', ')

/**
 * Get data on CSS features not supported by the given autoprefixer-like
 * browser selection.
 *
 * @returns `{browsers, features}`, where `features` is an array of:
 * ```
 * {
 *   'feature-name': {
 *     title: 'Title of feature'
 *     missing: "IE (8), Chrome (31)"
 *     missingData: {
 *       // map of browser -> version -> (lack of)support code
 *       ie: { '8': 'n' },
 *       chrome: { '31': 'n' }
 *     }
 *     partialData: {
 *       // map of browser -> version -> (partial)support code
 *       ie: { '7': 'a' },
 *       ff: { '29': 'a #1' }
 *     }
 *     caniuseData: {
 *       // caniuse-db json data for this feature
 *     }
 *   },
 *   'feature-name-2': {} // etc.
 * }
 * ```
 *
 * `feature-name` is a caniuse-db slug.
 */
function missing (browserRequest, from) {
  const browsers = new BrowserSelection(browserRequest, from)
  let result = {}

  Object.keys(features).forEach(function (feature) {
    const featureData = caniuse.feature(caniuse.features[feature])
    const lackData = filterStats(browsers, featureData.stats)
    const missingData = lackData.missing
    const partialData = lackData.partial
    // browsers with missing or partial support for this feature
    const missing = lackingBrowsers(missingData)
    const partial = lackingBrowsers(partialData)

    if (missing.length > 0 || partial.length > 0) {
      result[feature] = {
        title: featureData.title,
        caniuseData: featureData
      }
      if (missing.length > 0) {
        result[feature].missingData = missingData
        result[feature].missing = missing
      }
      if (partial.length > 0) {
        result[feature].partialData = partialData
        result[feature].partial = partial
      }
    }
  })

  return {
    browsers: browsers.list(),
    features: result
  }
}

module.exports = missing
