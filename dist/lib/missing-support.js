'use strict';

var features = require('../data/features');
var BrowserSelection = require('./browsers');
var _ = require('lodash');
var fs = require('fs');
var formatBrowserName = require('./util').formatBrowserName;

function filterStats(browsers, stats) {
  return _.transform(stats, function (resultStats, versionData, browser) {
    // filter only versions of selected browsers that don't support this
    // feature (i.e., don't have 'y' in their stats)
    var versWithoutSupport = _.transform(versionData, function (result, support, ver) {
      var selected = browsers.test(browser, ver);
      if (selected && !/(^|\s)y($|\s)/.test(support)) {
        result[selected[1]] = support;
      }
    });
    // filter out browsers for which there are *no* (selected) versions lacking
    // support.
    if (_.keys(versWithoutSupport).length !== 0) {
      resultStats[browser] = versWithoutSupport;
    }
  });
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
function missing(browserRequest) {
  var browsers = new BrowserSelection(browserRequest);

  var result = {};

  Object.keys(features).forEach(function (feature) {
    var json = fs.readFileSync(require.resolve('caniuse-db/features-json/' + feature));
    var featureData = JSON.parse(json);
    var missingData = filterStats(browsers, featureData.stats);

    // browsers missing support for this feature
    var missing = _.reduce(missingData, function (res, versions, browser) {
      res.push(formatBrowserName(browser, _.keys(versions)));
      return res;
    }, []).join(', ');

    if (missing.length > 0) {
      result[feature] = {
        title: featureData.title,
        missing: missing,
        missingData: missingData,
        caniuseData: featureData
      };
    }
  });

  return {
    browsers: browsers.list(),
    features: result
  };
}

module.exports = missing;