browserslist = require('browserslist')
_ = require('lodash')

module.exports =
class BrowserSelection
  constructor: (@browsersRequest)->
    @_list = browserslist(@browsersRequest).map (s)->s.split(' ')
  # browser: a browser name ('chrome', 'ie', etc.)
  # version: either a version ('11', '7.1') or a range ('5.0-8.0')
  # return undefined or one matching [b, v] pair from the selected browsers
  test: (browser, version)->
    version = version.split('-')
    if (version.length is 1) then version.push(version[0])
    _.find @_list, ([b, v])->
      b is browser and v >= version[0] and v <= version[1]
    
  list: -> @_list.slice()
