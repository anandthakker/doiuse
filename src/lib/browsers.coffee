Browsers = require('autoprefixer-core/lib/browsers')
browsersData = require('autoprefixer-core/data/browsers')

module.exports = (browsersRequest)->
  new Browsers(browsersData, browsersRequest)
