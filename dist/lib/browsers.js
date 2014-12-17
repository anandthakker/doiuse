var BrowserSelection, browserslist, _;

browserslist = require('browserslist');

_ = require('lodash');

module.exports = BrowserSelection = (function() {
  function BrowserSelection(browsersRequest) {
    this.browsersRequest = browsersRequest;
    this._list = browserslist(this.browsersRequest).map(function(s) {
      return s.split(' ');
    });
  }

  BrowserSelection.prototype.test = function(browser, version) {
    version = version.split('-');
    if (version.length === 1) {
      version.push(version[0]);
    }
    return _.find(this._list, function(_arg) {
      var b, v;
      b = _arg[0], v = _arg[1];
      return b === browser && v >= version[0] && v <= version[1];
    });
  };

  BrowserSelection.prototype.list = function() {
    return this._list.slice();
  };

  return BrowserSelection;

})();
