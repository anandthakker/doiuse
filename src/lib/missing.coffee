features = require('../data/features')
BrowserSelection = require('./browsers')
_ = require('lodash')
fs = require('fs')


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

missing = (browserRequest, cb) ->
  cb ?= ->
  browsers = new BrowserSelection(browserRequest)

  result = {}

  for feature, data of features
    json = fs.readFileSync(require.resolve('caniuse-db/features-json/'+feature))
    featureData = JSON.parse(json)
    result[feature] = filterStats(browsers, featureData.stats)
  
  result

module.exports = missing
