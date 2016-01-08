let features = require('../data/features')
let BrowserSelection = require('./browsers')
let _ = require('lodash')
let formatBrowserName = require('./util').formatBrowserName

let caniuse = require('caniuse-db/fulldata-json/data-1.0')

function filterStats (browsers, stats) {
  return _.transform(stats, (resultStats, versionData, browser) => {
    // filter only versions of selected browsers that don't support this
    // feature (i.e., don't have 'y' in their stats)
    let versWithoutSupport = _.transform(versionData, (result, support, ver) => {
      let selected = browsers.test(browser, ver)
      if (selected && (!/(^|\s)y($|\s)/.test(support))) {
        result[selected[1]] = support
      }
    })
    // filter out browsers for which there are *no* (selected) versions lacking
    // support.
    if (_.keys(versWithoutSupport).length !== 0) {
      resultStats[browser] = versWithoutSupport
    }
  })
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
  let browsers = new BrowserSelection(browserRequest)

  let result = {}

  Object.keys(features).forEach((feature) => {
    let featureData = caniuse.data[feature]
    let missingData = filterStats(browsers, featureData.stats)

    // browsers missing support for this feature
    let missing = _.reduce(missingData, (res, versions, browser) => {
      res.push(formatBrowserName(browser, _.keys(versions)))
      return res
    }, [])
      .join(', ')

    if (missing.length > 0) {
      result[feature] = {
        title: featureData.title,
        missing,
        missingData,
        caniuseData: featureData
      }
    }
  })

  return {
    browsers: browsers.list(),
    features: result
  }
}

module.exports = missing
