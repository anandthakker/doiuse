features = require('../data/features')
BrowserSelection = require('./browsers')
_ = require('lodash')
fs = require('fs')
formatBrowserName = require('./util').formatBrowserName


filterStats = (browsers, stats)->
  _.transform stats, (resultStats, versionData, browser)->
    # filter only versions of selected browsers that don't support this feature
    # (i.e., don't have 'y' in their stats)
    versionsWithoutSupport = _.transform versionData, (result, support, ver)->
      selected = browsers.test(browser, ver)
      if selected? and (not /(^|\s)y($|\s)/.test support)
        result[selected[1]] = support
    # filter out browsers for which there are *no* (selected) versions lacking
    # support.
    unless _.keys(versionsWithoutSupport).length is 0
      resultStats[browser] = versionsWithoutSupport

###
Get data on CSS features not supported by the given autoprefixer-like browser
selection.

Returns:
```
{
  'feature-name': {
    missing: {
      'ie': '8', // etc.
    }
    caniuseData: {
      // caniuse-db json data for this feature
    }
  },
  'feature-name-2': {} // etc.
}
```

`feature-name` is a caniuse-db slug.

###
missing = (browserRequest) ->
  browsers = new BrowserSelection(browserRequest)

  result = {}

  for feature, data of features
    json = fs.readFileSync(require.resolve('caniuse-db/features-json/'+feature))
    featureData = JSON.parse(json)
    missingData = filterStats(browsers, featureData.stats)
    missing = _.reduce(missingData, (res, versions, browser)->
      res.push(formatBrowserName(browser, _.keys(versions)))
      res
    , [])
    
    result[feature] =
      missing: missing
      missingData: missingData
      caniuseData: featureData
      
  browsers: browsers.list()
  features: result

module.exports = missing
