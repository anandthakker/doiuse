should = require('should')
missingSupport = require('../dist/lib/missing')

describe 'filtering caniuse-db data by browser selection', ->
  describe 'ignore lacking support in previous versions', ->
    it 'for browser request ie >= 7, safari >= 6, opera >= 10.1',->
      data = missingSupport(['ie >= 7', 'safari >= 6', 'opera >= 10.1'])
      bgimgopts = data['background-img-opts']
      bgimgopts.should.have.keys('ie', 'safari', 'opera')
      bgimgopts['ie'].should.have.keys('7', '8')
      bgimgopts['safari'].should.have.keys('6', '6.1')
