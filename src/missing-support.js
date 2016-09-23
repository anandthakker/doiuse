let features = require('../data/features')
let BrowserSelection = require('./browsers')
let _ = require('lodash')
let formatBrowserName = require('./util').formatBrowserName

let caniuse = require('caniuse-db/fulldata-json/data-1.0')

function filterStats (browsers, stats) {
  return _.reduce(stats, function (resultStats, versionData, browser) {
    // filter only versions of selected browsers that don't fully support this feature
    const feature = _.reduce(versionData, function (result, support, ver) {
      const selected = browsers.test(browser, ver)
      if (selected) {
        // check if browser is NOT fully (i.e., don't have 'y' in their stats) supported
        if (!(/(^|\s)y($|\s)/.test(support))) {
          // when it's not partially supported ('a'), it's missing
          const testprop = (/(^|\s)a($|\s)/.test(support) ? 'partial' : 'missing')
          if (!result[testprop]) {
            result[testprop] = {}
          }
          result[testprop][selected[1]] = support
        }
      }
      return result
    }, { missing: {}, partial: {} })

    if (_.keys(feature.missing).length !== 0) {
      resultStats.missing[browser] = feature.missing
    }
    if (_.keys(feature.partial).length !== 0) {
      resultStats.partial[browser] = feature.partial
    }
    return resultStats
  }, { missing: {}, partial: {} })
}
function lackingBrowsers (browserStats) {
  return _.reduce(browserStats, function (res, versions, browser) {
    res.push(formatBrowserName(browser, _.keys(versions)))
    return res
  }, []).join(', ')
}

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
function missing (browserRequest) {
  const browsers = new BrowserSelection(browserRequest)
  let result = {}

  Object.keys(features).forEach(function (feature) {
    const featureData = caniuse.data[feature]
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
