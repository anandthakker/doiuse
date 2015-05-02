should = require('chai').should()
missingSupport = require('../dist/lib/missing-support')

describe 'missing-support', ->
  it 'provides list of selected browsers', ->
    data = missingSupport(['ie >= 8'])
    data.browsers.sort((a,b)->Number(a[1])-Number(b[1])).should.deep.equal [
      ['ie','8']
      ['ie','9']
      ['ie', '10']
      ['ie', '11']
    ]

  describe 'filtering caniuse-db data by browser selection', ->
    it 'for browser request ie >= 7, safari >= 6, opera >= 10.1',->
      data = missingSupport(['ie >= 7', 'safari >= 6'])
        .features

      bgimgopts = data['background-img-opts']

      bgimgopts.should.have.keys('missing','title','missingData','caniuseData')

      missing = bgimgopts.missingData
      missing.should.have.keys('ie', 'safari')
      missing['ie'].should.have.keys('7', '8')
      missing['safari'].should.have.keys('6', '6.1')

    it 'only yields features not supported by selected browser', ->
      data = missingSupport(['ie 8']).features
      for f, featureData of data
        featureData.missingData.should.have.keys('ie')
