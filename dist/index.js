var Detector, SourceMapConsumer, doiuse, featureData, missingSupport, _;

_ = require('lodash');

missingSupport = require('./lib/missing-support');

Detector = require('./lib/detect-feature-use');

featureData = require('./data/features');

SourceMapConsumer = require('source-map').SourceMapConsumer;

doiuse = function(_arg) {
  var browsers, cb, detector, features, onFeatureUsage, _ref;
  browsers = _arg.browsers, onFeatureUsage = _arg.onFeatureUsage;
  if (browsers == null) {
    browsers = doiuse["default"].slice();
  }
  cb = onFeatureUsage != null ? onFeatureUsage : function() {};
  _ref = missingSupport(browsers), browsers = _ref.browsers, features = _ref.features;
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
        var feature, loc, message, usage, _ref1, _ref2;
        feature = _arg1.feature, usage = _arg1.usage;
        loc = usage.source;
        loc.original = css.prevMap != null ? {
          start: css.prevMap.consumer().originalPositionFor(loc.start),
          end: css.prevMap.consumer().originalPositionFor(loc.end)
        } : {
          start: loc.start,
          end: loc.end
        };
        message = ((_ref1 = (_ref2 = loc.original.start.source) != null ? _ref2 : loc.input.file) != null ? _ref1 : loc.input.from) + ':' + loc.original.start.line + ':' + loc.original.start.column + ': ' + features[feature].title + ' not supported by: ' + features[feature].missing;
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
