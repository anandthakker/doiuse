var Detector, features, matches, _;

_ = require('lodash');

features = require('../data/features');

matches = function(str) {
  return function(test) {
    return str.indexOf(test) >= 0;
  };
};

Detector = (function() {
  function Detector(featureList) {
    this.features = _.pick(features, featureList);
  }

  Detector.prototype.decl = function(decl) {
    var data, feat, prop, result, _i, _len, _ref, _ref1, _ref2;
    result = [];
    _ref = this.features;
    for (feat in _ref) {
      data = _ref[feat];
      _ref2 = ((_ref1 = data.properties) != null ? _ref1 : []).filter(matches(decl.prop));
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        prop = _ref2[_i];
        if ((data.values == null) || _.find(data.values, matches(decl.value))) {
          result.push({
            usage: decl,
            feature: feat
          });
          break;
        }
      }
    }
    return result;
  };

  Detector.prototype.rule = function(rule) {
    var data, feat, results, _ref, _ref1;
    results = _.flatten(rule.childs.map((function(_this) {
      return function(decl) {
        return _this.decl(decl);
      };
    })(this)));
    _ref = this.features;
    for (feat in _ref) {
      data = _ref[feat];
      if (_.find((_ref1 = data.selectors) != null ? _ref1 : [], matches(rule.selector))) {
        results.push({
          usage: rule,
          feature: feat
        });
      }
    }
    return results;
  };

  Detector.prototype.detect = function(css) {
    return _.flatten(css.childs.map((function(_this) {
      return function(rule) {
        return _this.rule(rule);
      };
    })(this)));
  };

  return Detector;

})();

module.exports = Detector;
