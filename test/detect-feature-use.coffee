fs = require('fs')
path = require('path')
should = require('should')
postcss = require('postcss')
Detector = require('../dist/lib/detect-feature-use')

parseTestCase = (cssString) ->
  matches = cssString.match(/^\s*\/\*\s*expect:\s*([a-zA-Z0-9\-:\s\n]*)/)
  return unless matches?
  features = {}
  for s in matches[1].split('\n').filter((s)->s.trim().length > 0)
    [feat,count] = s.replace(/\s*/,'').split(':')
    count = parseInt(count, 10)
    features[feat] = count
    
  if Object.keys(features).length > 0 then features else false

spy= ->
  results = []
  fn = ({feature,usage}) ->
    obj=
      feature: feature
      location: usage.source.start
      selector: usage.selector
      property: usage.property
      value: usage.value
    results[feature] ?= []
    results[feature].push obj

  fn.results = results
  fn


test = (tc, cssString, expected)->
  features = Object.keys(expected)
  describe "detecting CSS features (#{tc.replace('.css','')})", ->
    it "detects #{features.join(',')}", ->
      detector = new Detector(features)
      cb = spy()
      detector.process(postcss.parse(cssString), cb)
      cb.results.should.have.keys(features)
      for feature,count of expected
        cb.results[feature].should.have.lengthOf(count)
  

cases = fs.readdirSync(path.join(__dirname,'/cases'))
for tc in cases
  cssString = fs.readFileSync(path.join(__dirname, 'cases', tc)).toString()
  if (expected = parseTestCase(cssString))
    test(tc, cssString, expected)
