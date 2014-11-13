var browsers, data, feature, features;

browsers = require('automissinger-core/data/browsers');

features = require('./features');

feature = function(data, opts, callback) {
  var blah, browser, interval, k, match, missing, sorted, support, version, versions, _i, _j, _len, _len1, _ref, _ref1, _ref2, _ref3;
  if (!callback) {
    _ref = [opts, {}], callback = _ref[0], opts = _ref[1];
  }
  missing = {
    n: [],
    a: [],
    u: []
  };
  match = new RegExp(((function() {
    var _results;
    _results = [];
    for (k in missing) {
      blah = missing[k];
      _results.push("(^|\s)" + k + "($|\s)");
    }
    return _results;
  })()).join('|'), 'g');
  _ref1 = data.stats;
  for (browser in _ref1) {
    versions = _ref1[browser];
    for (interval in versions) {
      support = versions[interval];
      _ref2 = interval.split('-');
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        version = _ref2[_i];
        if (!browsers[browser]) {
          continue;
        }
        version = version.replace(/\.0$/, '');
        _ref3 = support.match(match);
        for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
          k = _ref3[_j];
          missing[k].push(browser + ' ' + version);
        }
      }
    }
  }
  sorted = function(list) {
    return list.sort(function(a, b) {
      a = a.split(' ');
      b = b.split(' ');
      if (a[0] > b[0]) {
        return 1;
      } else if (a[0] < b[0]) {
        return -1;
      } else {
        return parseFloat(a[1]) - parseFloat(b[1]);
      }
    });
  };
  for (k in missing) {
    blah = missing[k];
    missing[k] = sorted(missing[k]);
  }
  return callback(missing);
};

module.exports = {};

for (feature in features) {
  data = features[feature];
  feature(require('caniuse-db/features-json/' + feature), function(data) {
    return module.exports[feature] = data;
  });
}
