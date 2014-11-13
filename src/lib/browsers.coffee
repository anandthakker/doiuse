Browsers = require('autoprefixer-core/lib/browsers')
browsersData = require('autoprefixer-core/data/browsers')
_ = require('lodash')

module.exports =
class BrowserSelection
  constructor: (@browsersRequest)->
    @browsers = new Browsers(browsersData, @browsersRequest)
    @list = @browsers.selected.map (s)->s.split(' ')
  # browser: a browser name ('chrome', 'ie', etc.)
  # version: either a version ('11', '7.1') or a range ('5.0-8.0')
  # return undefined or one matching [b, v] pair from the selected browsers
  test: (browser, version)->
    version = version.split('-')
    if (version.length is 1) then version.push(version[0])
    _.find @list, ([b, v])->
      b is browser and v >= version[0] and v <= version[1]
    
