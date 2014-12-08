var Detector, doiuse, featureData, missingSupport, _;

_ = require('lodash');

missingSupport = require('./lib/missing-support');

Detector = require('./lib/detect-feature-use');

featureData = require('./data/features');

doiuse = function(_arg) {
  var browserSelection, browsers, cb, detector, features, onUnsupportedFeatureUse, _ref;
  browserSelection = _arg.browserSelection, onUnsupportedFeatureUse = _arg.onUnsupportedFeatureUse;
  if (browserSelection == null) {
    browserSelection = doiuse["default"].slice();
  }
  cb = onUnsupportedFeatureUse != null ? onUnsupportedFeatureUse : function() {};
  _ref = missingSupport(browserSelection), browsers = _ref.browsers, features = _ref.features;
  detector = new Detector(_.keys(features));
  return {
    info: function() {
      return {
        browsers: browsers,
        features: features
      };
    },
    postcss: function(css) {
      return detector.process(css, function(_arg1) {
        var feature, loc, message, usage, _ref1;
        feature = _arg1.feature, usage = _arg1.usage;
        loc = usage.source;
        message = ((_ref1 = loc.file) != null ? _ref1 : loc.id) + ':' + loc.start.line + ':' + loc.start.column + ': ' + features[feature].title + ' not supported by: ' + features[feature].missing;
        return cb({
          feature: feature,
          featureData: features[feature],
          usage: usage,
          message: message
        });
      });
    }
  };
};

doiuse["default"] = ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1'];

module.exports = doiuse;
