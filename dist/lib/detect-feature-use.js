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

  Detector.prototype.decl = function(decl, cb) {
    var data, feat, prop, _ref, _results;
    _ref = this.features;
    _results = [];
    for (feat in _ref) {
      data = _ref[feat];
      _results.push((function() {
        var _i, _len, _ref1, _ref2, _results1;
        _ref2 = ((_ref1 = data.properties) != null ? _ref1 : []).filter(matches(decl.prop));
        _results1 = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          prop = _ref2[_i];
          if ((data.values == null) || _.find(data.values, matches(decl.value))) {
            cb({
              usage: decl,
              feature: feat
            });
            break;
          } else {
            _results1.push(void 0);
          }
        }
        return _results1;
      })());
    }
    return _results;
  };

  Detector.prototype.rule = function(rule, cb) {
    var data, feat, _ref, _ref1;
    _ref = this.features;
    for (feat in _ref) {
      data = _ref[feat];
      if (_.find((_ref1 = data.selectors) != null ? _ref1 : [], matches(rule.selector))) {
        cb({
          usage: rule,
          feature: feat
        });
      }
    }
    return this.process(rule, cb);
  };

  Detector.prototype.atrule = function(atrule, cb) {
    console.warn("@-rule unimplemented!");
    return this.process(atrule, cb);
  };

  Detector.prototype.process = function(node, cb) {
    return node.each((function(_this) {
      return function(child) {
        switch (child.type) {
          case 'rule':
            return _this.rule(child, cb);
          case 'decl':
            return _this.decl(child, cb);
          case 'atrule':
            return _this.atrule(child, cb);
        }
      };
    })(this));
  };

  return Detector;

})();

module.exports = Detector;
