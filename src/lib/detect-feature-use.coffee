_ = require('lodash')
features = require('../data/features')

matches = (str) -> (test) -> str.indexOf(test) >= 0

class Detector
  constructor: (featureList)->
    @features = _.pick(features, featureList)

  decl: (decl)->
    result = []
    for feat,data of @features
      for prop in (data.properties ? []).filter matches(decl.prop)
        if (not data.values?) or _.find(data.values, matches(decl.value))
          result.push {usage: decl, feature: feat}
          break
    result
  
  rule: (rule)->
    results = _.flatten(rule.childs.map (decl)=>@decl(decl))
    for feat, data of @features
      if _.find(data.selectors ? [], matches(rule.selector))
        results.push {usage: rule, feature: feat}
    results
    
  detect: (css)->
    _.flatten(css.childs.map (rule)=>@rule(rule))
    
    
module.exports = Detector
