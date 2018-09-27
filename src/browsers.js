const browserslist = require('browserslist')

class BrowserSelection {
  constructor (query, from) {
    this.browsersRequest = query
    this._list = browserslist(this.browsersRequest, from ? { path: from } : {}).map(browser => browser.split(' '))
  }

  test (browser, version) {
    const versions = version.split('-')

    if (versions.length === 1) {
      versions.push(versions[0])
    }

    return this._list.find(([b, v]) => b === browser && v >= versions[0] && v <= versions[1])
  }

  list () {
    return this._list.slice()
  }
}

module.exports = BrowserSelection
