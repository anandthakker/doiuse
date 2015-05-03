var agents;

agents = require('caniuse-db/data').agents;

module.exports = {
  formatBrowserName: function(browserKey, versions) {
    var browserName, _ref;
    browserName = (_ref = agents[browserKey]) != null ? _ref.browser : void 0;
    if (!versions) {
      return browserName;
    }
    return browserName + ' (' + versions.join(',') + ')';
  }
};
