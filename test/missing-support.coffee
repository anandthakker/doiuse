should = require('should')
missingSupport = require('../dist/lib/missing-support')

describe 'missing-support', ->
  describe 'filtering caniuse-db data by browser selection', ->
    it 'for browser request ie >= 7, safari >= 6, opera >= 10.1',->
      data = missingSupport(['ie >= 7', 'safari >= 6', 'opera >= 10.1'])
      bgimgopts = data['background-img-opts']
      
      bgimgopts.should.have.keys('missing', 'caniuseData')
      
      missing = bgimgopts.missing
      missing.should.have.keys('ie', 'safari', 'opera')
      missing['ie'].should.have.keys('7', '8')
      missing['safari'].should.have.keys('6', '6.1')
