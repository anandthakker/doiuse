var Detector, featureData, missingSupport, _;

_ = require('lodash');

missingSupport = require('./lib/missing-support');

Detector = require('./lib/detect-feature-use');

featureData = require('./data/features');


/*
Usage: `postcss(doiuse(opts))`.

`opts`:
  - `browsers`: an autoprefixer-like array of browsers.
  - `onUnsupportedFeatureUse`: `function(usageInfo)`
    `usageInfo` looks like this:
    ```
    {
      feature: 'css-gradients', //slug identifying a caniuse-db feature
      featureData:{
        missing: {
          // subset of selected browsers that are missing support for this
          // particular feature, mapped to the version and (lack of)support code
          ie: { '8': 'n' }
        },
        caniuseData: { // data from caniuse-db/features-json/[feature].json }
      },
      usage: //the postcss node where that feature is being used.
    }
    Called once for each usage of each css feature not supported by the selected
    browsers.
 */

module.exports = function(_arg) {
  var browsers, cb, detector, features, onUnsupportedFeatureUse;
  browsers = _arg.browsers, onUnsupportedFeatureUse = _arg.onUnsupportedFeatureUse;
  if (browsers == null) {
    browsers = [];
  }
  cb = onUnsupportedFeatureUse != null ? onUnsupportedFeatureUse : function() {};
  features = missingSupport(browsers);
  detector = new Detector(_.keys(features));
  return {
    postcss: function(css) {
      return detector.process(css, function(_arg1) {
        var feature, usage;
        feature = _arg1.feature, usage = _arg1.usage;
        return cb({
          feature: feature,
          featureData: features[feature],
          usage: usage
        });
      });
    }
  };
};
