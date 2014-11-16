fs = require('fs')
should = require('should')
postcss = require('postcss')

Detector = require('../dist/lib/detect-feature-use')

spy = require('./spec-helper').spy

describe 'feature detection', ->
  it 'background-img-opts', ->
    detector = new Detector(['background-img-opts'])
    detected = []
    detector.process(postcss.parse('''
      a { background-size: cover; }
      b { background-clip: padding-box; }
      c { background-origin: padding-box; }
      d { background-color: red; }
    '''), detected.push.bind(detected))
    detected.should.have.lengthOf(3)

  it 'css-gradients', ->
    detector = new Detector(['css-gradients'])
    css = fs.readFileSync(require.resolve('./cases/gradient.css'))
    
    cb = spy()
    detector.process(postcss.parse(css), cb)
    cb.results.should.have.lengthOf(11)
    
  it 'css-sel2', ->
    detector = new Detector(['css-sel2'])
    css = fs.readFileSync(require.resolve('./cases/selectors.css'))
    
    cb = spy()
    detector.process(postcss.parse(css), cb)
    cb.results.should.have.lengthOf(16)
    
  it 'css-sel3', ->
    detector = new Detector(['css-sel3'])
    css = fs.readFileSync(require.resolve('./cases/selectors.css'))
    
    cb = spy()
    detector.process(postcss.parse(css), cb)
    cb.results.should.have.lengthOf(20)

    
