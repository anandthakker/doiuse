var Browsers, browsersData;

Browsers = require('autoprefixer-core/lib/browsers');

browsersData = require('autoprefixer-core/data/browsers');

module.exports = function(browsersRequest) {
  return new Browsers(browsersData, browsersRequest);
};
