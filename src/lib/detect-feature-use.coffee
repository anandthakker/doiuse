_ = require('lodash')
features = require('../data/features')

###
str: string to search in.
searchfor: string or pattern to search for.
###
isFoundIn = (str) -> (searchfor) ->
  if searchfor instanceof RegExp then searchfor.test(str)
  else if _.isFunction(searchfor) then searchfor(str)
  else str?.indexOf(searchfor) >= 0

###
postcss the use of any of a given list of CSS features.

```
var detector = new Detector(featureList)
detector.process(css, cb)
```

`featureList`: an array of feature slugs (see caniuse-db)
`cb`: a callback that gets called for each usage of one of the given features,
called with an argument like:
```
{
  usage: {} // postcss node where usage was found
  feature: {} // caniuse-db feature slug
}
```
###
class Detector
  constructor: (featureList)->
    @features = _.pick(features, featureList)

  decl: (decl, cb)->
    for feat,data of @features
      for prop in (data.properties ? []).filter isFoundIn(decl.prop)
        if (not data.values?) or _.find(data.values, isFoundIn(decl.value))
          cb {usage: decl, feature: feat}
          break
  
  rule: (rule, cb)->
    for feat, data of @features
      if _.find(data.selectors ? [], isFoundIn(rule.selector))
        cb {usage: rule, feature: feat}
    
    @process(rule, cb)
  
  atrule: (atrule, cb)->
    for feat, data of @features
      if _.find(data.atrules ? [], isFoundIn(atrule.name)) and
      (!data.params or _.find(data.params, isFoundIn(atrule.params)))
        cb {usage: atrule, feature: feat}

    @process(atrule, cb)
    
  process: (node, cb)->
    node.each (child) =>
      switch child.type
        when 'rule' then @rule(child, cb)
        when 'decl' then @decl(child, cb)
        when 'atrule' then @atrule(child, cb)
    
module.exports = Detector
