var agents;

agents = require('caniuse-db/data').agents;

module.exports = {
  formatBrowserName: function(browserKey, versions) {
    var browserName, ref;
    browserName = (ref = agents[browserKey]) != null ? ref.browser : void 0;
    if (!versions) {
      return browserName;
    }
    return browserName + ' (' + versions.join(',') + ')';
  }
};
