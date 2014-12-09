list = require('postcss/lib/list')

pats=
  attrcc: '[^\\~|^$*\\]]*'
  brackets: /(\[[^\]]*\]|\([^\)]*\))/.source
  nobrackets: /[^\[\]\(\)]/.source

matchOutsideOfBrackets= (pat) ->
  if pat instanceof RegExp then pat = pat.source
  new RegExp("^(#{pats.brackets}?#{pats.nobrackets}*)*#{pat}")

module.exports=
  # Border Radius
  'border-radius':
    properties: [
      'border-radius'
      'border-top-left-radius'
      'border-top-right-radius'
      'border-bottom-right-radius'
      'border-bottom-left-radius']

  # Box Shadow
  'css-boxshadow':
    properties: ['box-shadow']

  # Animation
  'css-animation':
    properties: [
      'animation'
      'animation-name'
      'animation-duration'
      'animation-delay'
      'animation-direction'
      'animation-fill-mode'
      'animation-iteration-count'
      'animation-play-state'
      'animation-timing-function'
      '@keyframes']

  # Transition
  'css-transitions':
    properties: [
      'transition'
      'transition-property'
      'transition-duration'
      'transition-delay'
      'transition-timing-function']

  # Transform 2D
  'transforms2d':
    properties: [
      'transform'
      'transform-origin']

  # Transform 3D
  'transforms3d':
    properties: [
      'perspective'
      'perspective-origin'
      'transform-style'
      'backface-visibility']

  # Gradients
  'css-gradients':
    properties: [
      'background'
      'background-image'
      'border-image']
      
    values: [
      /(^|[^-])linear-gradient/
      /(^|[^-])radial-gradient/
    ]

  # Box sizing
  'css3-boxsizing':
    properties: ['box-sizing']

  # Filter Effects
  'css-filters':
    properties: ['filter']

  # Multicolumns
  'multicolumn':
    properties: [
      'columns'
      'column-width'
      'column-gap'
      'column-rule'
      'column-rule-color'
      'column-rule-width'
      'column-count'
      'column-rule-style'
      'column-span'
      'column-fill'
      'break-before'
      'break-after'
      'break-inside']

  # User select
  'user-select-none':
    properties: ['user-select']

  # Flexible Box Layout
  'flexbox':
    properties: ['display']
    values: [
      'display-flex'
      'inline-flex'
      'flex'
      'flex-grow'
      'flex-shrink'
      'flex-basis'
      'flex-direction'
      'flex-wrap'
      'flex-flow'
      'justify-content'
      'order'
      'align-items'
      'align-self'
      'align-content']

  # calc() unit
  'calc':
    values: ['calc']
    properties: [''] # any property

  # Background options
  'background-img-opts':
    properties: [
      'background-clip'
      'background-origin'
      'background-size']

  # Font feature settings
  'font-feature':
    properties: [
      'font-feature-settings'
      'font-variant-ligatures'
      'font-language-override'
      'font-kerning']

  # Border image
  'border-image':
    properties: ['border-image']

  # Selection selector
  'css-selection':
    properties: ['::selection']
    selector: true
      # Placeholder selector
  'css-placeholder':
    properties: ['::placeholder']
    selector: true
      # Hyphenation
  'css-hyphens':
    properties: ['hyphens']

  # Fullscreen selector
  'fullscreen':
    properties: [':fullscreen']
    selector: true
      # Tab size
  'css3-tabsize':
    properties: ['tab-size']

  # Intrinsic & extrinsic sizing
  'intrinsic-width':
    properties: [
      'width'
      'min-width'
      'max-width'
      'height'
      'min-height'
      'max-height']
    values: [
      'max-content'
      'min-content'
      'fit-content'
      'fill-available']

  # Zoom and grab cursor
  'css3-cursors-newer':
    properties: ['cursor']
    values: [
      'zoom-in'
      'zoom-out'
      'grab'
      'grabbing']

  # Sticky position
  'css-sticky':
    properties: ['position']
    values: ['sticky']

  # Pointer Events
  'pointer':
    properties: ['touch-action']

  # Text decoration
  'text-decoration':
    properties: [
      'text-decoration-style'
      'text-decoration-line'
      'text-decoration-color']

  # Text Size Adjust
  'text-size-adjust':
    properties: ['text-size-adjust']

  # CSS Masks
  'css-masks':
    properties: [
      'clip-path'
      'mask'
      'mask-clip'
      'mask-composite'
      'mask-image'
      'mask-origin'
      'mask-position'
      'mask-repeat'
      'mask-size']
   
  # @font-face Web fonts
  'fontface':
    atrules: ['font-face']

  # CSS3 Multiple backgrounds
  'multibackgrounds': {
    properties: [ /^background-?/ ]
    values: [ (value) -> list.comma(value).length > 1 ]
  }

  # CSS Table display
  'css-table':
    properties: ['display']
    values: ['table','table-cell','table-row','table-layout']

  # CSS Generated content for pseudo-elements
  'css-gencontent':
    selectors: [':before', ':after']

  # CSS position:fixed
  'css-fixed':
    properties: ['position']
    values: ['fixed']

  # CSS 2.1 selectors
  'css-sel2':
    selectors: [
      matchOutsideOfBrackets(/\*/)
      matchOutsideOfBrackets(/\>/)
      matchOutsideOfBrackets(/\+/)
      matchOutsideOfBrackets(/\./)
      matchOutsideOfBrackets(/#/)
      ':first-child'
      ':link'
      ':visited'
      ':active'
      ':hover'
      ':focus'
      ':lang'
      new RegExp("\\[#{pats.attrcc}\\]")
      new RegExp("\\[#{pats.attrcc}=#{pats.attrcc}\\]")
      new RegExp("\\[#{pats.attrcc}\\~=#{pats.attrcc}\\]")
      new RegExp("\\[#{pats.attrcc}\\|=#{pats.attrcc}\\]")
    ]


  # CSS3 selectors
  'css-sel3':
    selectors: [
      new RegExp("\\[#{pats.attrcc}\\^=#{pats.attrcc}\\]")
      new RegExp("\\[#{pats.attrcc}\\$=#{pats.attrcc}\\]")
      new RegExp("\\[#{pats.attrcc}\\*=#{pats.attrcc}\\]")
      ':root'
      ':nth-child'
      ':nth-last-child'
      'nth-of-type'
      'nth-last-of-type'
      ':last-child'
      ':first-of-type'
      ':last-of-type'
      ':only-child'
      ':only-of-type'
      ':empty'
      ':target'
      ':enabled'
      ':disabled'
      ':checked'
      ':not'
      /^[^\[]*~/ ]

  # CSS3 Text-shadow
  'css-textshadow':
    properties: ['text-shadow']

  # CSS3 Colors
  'css3-colors':
    properties: ['']
    values: [
      'rgba'
      'hsl'
      'hsla'
    ]

  # CSS3 Media Queries
  'css-mediaqueries':
    atrules: ['media']

  # CSS Canvas Drawings
  'css-canvas':
    properties: [ /^background/ ]
    values: [ /^-webkit-canvas/ ]

  # CSS Reflections
  'css-reflections':
    properties: ['box-reflect']

  # SVG in CSS backgrounds
  'svg-css':{ unimplemented: true }

  # CSS Feature Queries
  'css-featurequeries':{
    atrules: [ 'supports' ]
  }

  # CSS3 Opacity
  'css-opacity':
    properties: [ 'opacity' ]

  # CSS3 Text-overflow
  'text-overflow':
    properties: [ 'text-overflow' ]

  # CSS3 Overflow-wrap
  'wordwrap':
    properties: [ 'overflow-wrap' ]

  # CSS3 object-fit/object-position
  'object-fit':
    properties: [ 'object-fit' ]

  # CSS min/max-width/height
  'minmaxwh':
    properties: [
      'min-width'
      'max-width'
      'min-height'
      'max-height'
    ]

  # CSS text-stroke
  'text-stroke':{ unimplemented: true }

  # CSS inline-block
  'inline-block':
    properties: ['display']
    values: ['inline-block']

  # CSS Grid Layout
  'css-grid':{ unimplemented: true }

  # rem (root em) units
  'rem':
    properties: ['']
    values: ['rem']

  # TTF/OTF - TrueType and OpenType font support
  'ttf':{ unimplemented: true }

  # CSS pointer-events (for HTML)
  'pointer-events':
    properties: ['pointer-events']

  # CSS Regions
  'css-regions':{ unimplemented: true }

  # CSS Counters
  'css-counters':
    properties: ['counter-reset', 'counter-increment']
    # TODO: property: content, value: counter(...) or counters(...)

  # CSS resize property
  'css-resize':
    properties: ['resize']

  # CSS Repeating Gradients
  'css-repeating-gradients':
    properties: ['']
    values: ['repeating-linear-gradient', 'repeating-radial-gradient']

  # CSS3 word-break
  'word-break':
    properties: [ 'word-break' ]

  # Viewport units: vw, vh, vmin, vmax
  'viewport-units':
    properties: ['']
    values: [ 'vw', 'vh', 'vmin', 'vmax' ]

  # CSS outline
  'outline':
    properties: [
      'outline'
      'outline-style'
      'outline-width'
      'outline-color'
    ]

  # CSS3 Cursors (original values)
  'css3-cursors':
    properties: ['cursor']
    values: [
      'none'
      'context-menu'
      'cell'
      'vertical-text'
      'alias'
      'copy'
      'no-drop'
      'not-allowed'
      'nesw-resize'
      'nwse-resize'
      'col-resize'
      'row-resize'
      'all-scroll'
    ]
  
  'css3-cursors-newer':
    properties: ['cursor']
    values: [
      'zoom-in'
      'zoom-out'
    ]

  # CSS Variables
  'css-variables':{ unimplemented: true }

  # CSS background-blend-mode
  'css-backgroundblendmode':
    properties: ['background-blend-mode']

  # Blending of HTML/SVG elements
  'css-mixblendmode':
    properties: ['mix-blend-mode']

  # CSS will-change property
  'will-change':
    properties: ['will-change']

  # CSS Shapes Level 1
  'css-shapes':
    properties: ['shape-outside', 'shape-image-threshold', 'shape-margin']

  # Improved kerning pairs & ligatures
  'kerning-pairs-ligatures':
    properties: ['text-rendering']
    values: ['optimizeLegibility']

  # CSS3 image-orientation
  'css-image-orientation':
    properties: ['image-orientation']

  # CSS Appearance
  'css-appearance':
    properties: ['appearance']

  # CSS background-position edge offsets
  'css-background-offsets':{ unimplemented: true }

  # CSS touch-action property
  'css-touch-action':
    properties: ['touch-action']

  # CSS clip-path property
  'css-clip-path':
    properties: ['clip-path']

  # Font unicode-range subsetting
  'font-unicode-range':
    atrules: ['font-face']
    properties: ['unicode-range']

  # CSS font-stretch
  'css-font-stretch':
    properties: ['font-stretch']

  # CSS font-size-adjust
  'font-size-adjust':
    properties: ['font-size-adjust']

  # Media Queries: resolution feature
  'css-media-resolution':
    atrules: 'media'
    params: ['min-resolution', 'max-resolution']

  # CSS image-set
  'css-image-set':
    properties: ['']
    values: ['image-set']
