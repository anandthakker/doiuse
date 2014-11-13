browsers = require('automissinger-core/data/browsers')
features = require('./features')

# Convert Can I Use data
# Adapted from automissinger-core/data/missinges.coffee
feature = (data, opts, callback) ->
  [callback, opts] = [opts, { }] unless callback

  missing =
    n: [] # no support
    a: [] # almost support (aka partial support)
    u: [] # unknown support
    
  match = new RegExp(("(^|\s)#{k}($|\s)" for k,blah of missing).join('|'),'g')

  for browser, versions of data.stats
    for interval, support of versions
      for version in interval.split('-')
        continue unless browsers[browser]
        version = version.replace(/\.0$/, '')
        for k in support.match(match)
          missing[k].push(browser + ' ' + version)

  sorted = (list) ->
    list.sort (a, b) ->
      a = a.split(' ')
      b = b.split(' ')
      if a[0] > b[0] then 1
      else if a[0] < b[0] then -1
      else (parseFloat(a[1]) - parseFloat(b[1]))
  
  for k,blah of missing
    missing[k] = sorted(missing[k])

  callback(missing)


module.exports = { }

for feature,data of features
  feature require('caniuse-db/features-json/'+feature), (data) ->
    module.exports[feature] = data
