agents = require('caniuse-db/data').agents

module.exports=
  formatBrowserName: (browserKey, versions) ->
    browserName = agents[browserKey]?.browser
    unless versions then return browserName
    (browserName + ' (' + versions.join(',') + ')')
