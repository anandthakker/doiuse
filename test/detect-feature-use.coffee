fs = require('fs')
path = require('path')
should = require('chai').should()
postcss = require('postcss')
Detector = require('../dist/lib/detect-feature-use')

parseTestCase = (cssString) ->
  meta = /\s*\/\*(\s*only)?\s*expect:\s*([a-zA-Z0-9\-:\s\n]*)/
  matches = cssString.match(meta)
  return unless matches?

  features = {}
  for s in matches[2].split('\n').filter((s)->s.trim().length > 0)
    [feat,count] = s.replace(/\s*/,'').split(':')
    count = parseInt(count, 10)
    features[feat] = count
    
  if Object.keys(features).length > 0
    only: matches[1]?
    expected: features
  else false

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


test = (tc, cssString, expected, only)->
  features = Object.keys(expected)
  describe "detecting CSS features (#{tc.replace('.css','')})", ->
    itfn = if only then it.only else it
    itfn "detects #{features.join(',')}", ->
      detector = new Detector(features)
      cb = spy()
      detector.process(postcss.parse(cssString), cb)
      cb.results.should.have.keys(features)
      for feature,count of expected
        cb.results[feature].should.have.lengthOf(count)

caseFiles = fs.readdirSync(path.join(__dirname,'/cases'))
cases = []
only = null
for tc in caseFiles
  continue unless /\.css$/.test(tc)
  cssString = fs.readFileSync(path.join(__dirname, 'cases', tc)).toString()
  if (parsed = parseTestCase(cssString))
    testCase = {name: tc, expected: parsed.expected, cssString}
    if parsed.only then only = [testCase]
    else cases.push testCase

cases = only ? cases

describe "detect feature usage", ->
  for {name, cssString, expected} in cases
    test(name, cssString, expected, cases.length is 1)
