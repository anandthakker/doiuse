fs = require('fs')
should = require('should')

doiuse = require('../dist')
postcss = require('postcss')

describe 'postcss plugin', ->
  it 'leaves css alone by default', ->
    css = fs.readFileSync(require.resolve('./cases/gradient.css')).toString()

    out = postcss(doiuse(
      browsers: ['ie >= 7', 'safari >= 6', 'opera >= 10.1']
    )).process(css).css
    
    out.should.be.equal(css)
    
  it 'calls back for unsupported feature usages', ->
    css = fs.readFileSync(require.resolve('./cases/gradient.css'))
    count = 0
    postcss(doiuse(
      browsers: ['ie 8']
      onUnsupportedFeatureUse: (usageInfo)->
        count++
        usageInfo.should.have.keys('feature', 'featureData', 'usage', 'message')
        usageInfo.featureData.should.have.keys(
          'title', 'missing','missingData', 'caniuseData')
    )).process(css)
    count.should.equal(17)
