var Detector, _, features, isFoundIn;

_ = require('lodash');

features = require('../data/features');


/*
str: string to search in.
searchfor: string or pattern to search for.
 */

isFoundIn = function(str) {
  return function(searchfor) {
    if (searchfor instanceof RegExp) {
      return searchfor.test(str);
    } else if (_.isFunction(searchfor)) {
      return searchfor(str);
    } else {
      return (str != null ? str.indexOf(searchfor) : void 0) >= 0;
    }
  };
};


/*
postcss the use of any of a given list of CSS features.

```
var detector = new Detector(featureList)
detector.process(css, cb)
```

`featureList`: an array of feature slugs (see caniuse-db)
`cb`: a callback that gets called for each usage of one of the given features,
called with an argument like:
```
{
  usage: {} // postcss node where usage was found
  feature: {} // caniuse-db feature slug
}
```
 */

Detector = (function() {
  function Detector(featureList) {
    this.features = _.pick(features, featureList);
  }

  Detector.prototype.decl = function(decl, cb) {
    var data, feat, prop, ref, results;
    ref = this.features;
    results = [];
    for (feat in ref) {
      data = ref[feat];
      results.push((function() {
        var i, len, ref1, ref2, results1;
        ref2 = ((ref1 = data.properties) != null ? ref1 : []).filter(isFoundIn(decl.prop));
        results1 = [];
        for (i = 0, len = ref2.length; i < len; i++) {
          prop = ref2[i];
          if ((data.values == null) || _.find(data.values, isFoundIn(decl.value))) {
            cb({
              usage: decl,
              feature: feat
            });
            break;
          } else {
            results1.push(void 0);
          }
        }
        return results1;
      })());
    }
    return results;
  };

  Detector.prototype.rule = function(rule, cb) {
    var data, feat, ref, ref1;
    ref = this.features;
    for (feat in ref) {
      data = ref[feat];
      if (_.find((ref1 = data.selectors) != null ? ref1 : [], isFoundIn(rule.selector))) {
        cb({
          usage: rule,
          feature: feat
        });
      }
    }
    return this.process(rule, cb);
  };

  Detector.prototype.atrule = function(atrule, cb) {
    var data, feat, ref, ref1;
    ref = this.features;
    for (feat in ref) {
      data = ref[feat];
      if (_.find((ref1 = data.atrules) != null ? ref1 : [], isFoundIn(atrule.name)) && (!data.params || _.find(data.params, isFoundIn(atrule.params)))) {
        cb({
          usage: atrule,
          feature: feat
        });
      }
    }
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
