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
    postcss(doiuse(
      browsers: ['ie 8']
      onUnsupportedFeatureUse: (usageInfo)->
        usageInfo.should.have.keys('feature', 'featureData', 'usage')
        usageInfo.featureData.should.have.keys('missing', 'caniuseData')
    )).process(css)
