
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
      'linear-gradient'
      'repeating-linear-gradient'
      'radial-gradient'
      'repeating-radial-gradient']

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
    atrules: ['@font-face']

  # CSS3 Multiple backgrounds
  'multibackgrounds': { unimplemented: true }

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
    atrules: ['@media']

  # CSS Canvas Drawings
  'css-canvas':{ unimplemented: true }

  # CSS Reflections
  'css-reflections':
    properties: ['box-reflect']

  # SVG in CSS backgrounds
  'svg-css':{ unimplemented: true }

  # CSS Feature Queries
  'css-featurequeries':{ unimplemented: true }

  # CSS3 Opacity
  'css-opacity':{ unimplemented: true }

  # CSS3 Text-overflow
  'text-overflow':{ unimplemented: true }

  # CSS3 Overflow-wrap
  'wordwrap':{ unimplemented: true }

  # CSS3 object-fit/object-position
  'object-fit':{ unimplemented: true }

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
  'pointer-events':{ unimplemented: true }

  # CSS Regions
  'css-regions':{ unimplemented: true }

  # CSS Counters
  'css-counters':{ unimplemented: true }

  # CSS resize property
  'css-resize':{ unimplemented: true }

  # CSS Repeating Gradients
  'css-repeating-gradients':{ unimplemented: true }

  # getComputedStyle
  'getcomputedstyle':{ unimplemented: true }

  # CSS3 word-break
  'word-break':{ unimplemented: true }

  # Viewport units: vw, vh, vmin, vmax
  'viewport-units':{ unimplemented: true }

  # Scoped CSS
  'style-scoped':{ unimplemented: true }

  # CSS outline
  'outline':{ unimplemented: true }

  # CSS3 Cursors (original values)
  'css3-cursors':{ unimplemented: true }

  # CSS Variables
  'css-variables':{ unimplemented: true }

  # CSS background-blend-mode
  'css-backgroundblendmode':{ unimplemented: true }

  # Blending of HTML/SVG elements
  'css-mixblendmode':{ unimplemented: true }

  # CSS will-change property
  'will-change':{ unimplemented: true }

  # CSS Shapes Level 1
  'css-shapes':{ unimplemented: true }

  # Improved kerning pairs & ligatures
  'kerning-pairs-ligatures':{ unimplemented: true }

  # CSS3 image-orientation
  'css-image-orientation':{ unimplemented: true }

  # CSS Appearance
  'css-appearance':{ unimplemented: true }

  # CSS background-position edge offsets
  'css-background-offsets':{ unimplemented: true }

  # CSS touch-action property
  'css-touch-action':{ unimplemented: true }

  # CSS clip-path property
  'css-clip-path':{ unimplemented: true }

  # CSS Font Loading
  'font-loading':{ unimplemented: true }

  # Font unicode-range subsetting
  'font-unicode-range':{ unimplemented: true }

  # CSS font-stretch
  'css-font-stretch':{ unimplemented: true }

  # CSS font-size-adjust
  'font-size-adjust':{ unimplemented: true }

  # Media Queries: resolution feature
  'css-media-resolution':{ unimplemented: true }

  # CSS image-set
  'css-image-set':{ unimplemented: true }
