var BrowserSelection, features, filterStats, formatBrowserName, fs, missing, _;

features = require('../data/features');

BrowserSelection = require('./browsers');

_ = require('lodash');

fs = require('fs');

formatBrowserName = require('./util').formatBrowserName;

filterStats = function(browsers, stats) {
  return _.transform(stats, function(resultStats, versionData, browser) {
    var versionsWithoutSupport;
    versionsWithoutSupport = _.transform(versionData, function(result, support, ver) {
      var selected;
      selected = browsers.test(browser, ver);
      if ((selected != null) && (!/(^|\s)y($|\s)/.test(support))) {
        return result[selected[1]] = support;
      }
    });
    if (_.keys(versionsWithoutSupport).length !== 0) {
      return resultStats[browser] = versionsWithoutSupport;
    }
  });
};


/*
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
 */

missing = function(browserRequest) {
  var browsers, data, feature, featureData, json, missingData, result;
  browsers = new BrowserSelection(browserRequest);
  result = {};
  for (feature in features) {
    data = features[feature];
    json = fs.readFileSync(require.resolve('caniuse-db/features-json/' + feature));
    featureData = JSON.parse(json);
    missingData = filterStats(browsers, featureData.stats);
    missing = _.reduce(missingData, function(res, versions, browser) {
      res.push(formatBrowserName(browser, _.keys(versions)));
      return res;
    }, []);
    if (missing.length !== 0) {
      result[feature] = {
        missing: missing,
        missingData: missingData,
        caniuseData: featureData
      };
    }
  }
  return {
    browsers: browsers.list(),
    features: result
  };
};

module.exports = missing;
