module.exports = {
  'border-radius': {
    properties: ['border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-right-radius', 'border-bottom-left-radius']
  },
  'css-boxshadow': {
    properties: ['box-shadow']
  },
  'css-animation': {
    properties: ['animation', 'animation-name', 'animation-duration', 'animation-delay', 'animation-direction', 'animation-fill-mode', 'animation-iteration-count', 'animation-play-state', 'animation-timing-function', '@keyframes']
  },
  'css-transitions': {
    properties: ['transition', 'transition-property', 'transition-duration', 'transition-delay', 'transition-timing-function']
  },
  'transforms2d': {
    properties: ['transform', 'transform-origin']
  },
  'transforms3d': {
    properties: ['perspective', 'perspective-origin', 'transform-style', 'backface-visibility']
  },
  'css-gradients': {
    properties: ['background', 'background-image', 'border-image'],
    values: ['linear-gradient', 'repeating-linear-gradient', 'radial-gradient', 'repeating-radial-gradient']
  },
  'css3-boxsizing': {
    properties: ['box-sizing']
  },
  'css-filters': {
    properties: ['filter']
  },
  'multicolumn': {
    properties: ['columns', 'column-width', 'column-gap', 'column-rule', 'column-rule-color', 'column-rule-width', 'column-count', 'column-rule-style', 'column-span', 'column-fill', 'break-before', 'break-after', 'break-inside']
  },
  'user-select-none': {
    properties: ['user-select']
  },
  'flexbox': {
    properties: ['display'],
    values: ['display-flex', 'inline-flex', 'flex', 'flex-grow', 'flex-shrink', 'flex-basis', 'flex-direction', 'flex-wrap', 'flex-flow', 'justify-content', 'order', 'align-items', 'align-self', 'align-content']
  },
  'calc': {
    values: ['calc'],
    properties: ['']
  },
  'background-img-opts': {
    properties: ['background-clip', 'background-origin', 'background-size']
  },
  'font-feature': {
    properties: ['font-feature-settings', 'font-variant-ligatures', 'font-language-override', 'font-kerning']
  },
  'border-image': {
    properties: ['border-image']
  },
  'css-selection': {
    properties: ['::selection'],
    selector: true
  },
  'css-placeholder': {
    properties: ['::placeholder'],
    selector: true
  },
  'css-hyphens': {
    properties: ['hyphens']
  },
  'fullscreen': {
    properties: [':fullscreen'],
    selector: true
  },
  'css3-tabsize': {
    properties: ['tab-size']
  },
  'intrinsic-width': {
    properties: ['width', 'min-width', 'max-width', 'height', 'min-height', 'max-height'],
    values: ['max-content', 'min-content', 'fit-content', 'fill-available']
  },
  'css3-cursors-newer': {
    properties: ['cursor'],
    values: ['zoom-in', 'zoom-out', 'grab', 'grabbing']
  },
  'css-sticky': {
    properties: ['position'],
    values: ['sticky']
  },
  'pointer': {
    properties: ['touch-action']
  },
  'text-decoration': {
    properties: ['text-decoration-style', 'text-decoration-line', 'text-decoration-color']
  },
  'text-size-adjust': {
    properties: ['text-size-adjust']
  },
  'css-masks': {
    properties: ['clip-path', 'mask', 'mask-clip', 'mask-composite', 'mask-image', 'mask-origin', 'mask-position', 'mask-repeat', 'mask-size']
  },
  'fontface': {
    atrules: ['@font-face']
  },
  'multibackgrounds': {},
  'css-table': {
    properties: ['display'],
    values: ['table', 'table-cell', 'table-row', 'table-layout']
  },
  'css-gencontent': {
    selectors: [':before', ':after']
  },
  'css-fixed': {
    properties: ['position'],
    values: ['fixed']
  },
  'css-sel2': {
    selectors: ['*', '>', ':first-child', ':link', ':visited', ':active', ':hover', ':focus', ':lang', '+', '[attr]', '[attr="val"]', '[attr~="val"]', '[attr|="bar"]', '.foo', '#foo']
  },
  'css-sel3': {
    selectors: ['[foo^="bar"]', '[foo$="bar"]', '[foo*="bar"]', ':root', ':nth-child', ':nth-last-child', 'nth-of-type', 'nth-last-of-type', ':last-child', ':first-of-type', ':last-of-type', ':only-child', ':only-of-type', ':empty', ':target', ':enabled', ':disabled', ':checked', ':not', '~']
  },
  'css-textshadow': {
    properties: ['text-shadow']
  },
  'css3-colors': {
    properties: [''],
    values: ['rgba', 'hsl', 'hsla']
  },
  'css-mediaqueries': {
    atrules: ['@media']
  },
  'css-canvas': {},
  'css-reflections': {
    properties: ['box-reflect']
  },
  'svg-css': {},
  'css-featurequeries': {},
  'css-opacity': {},
  'text-overflow': {},
  'wordwrap': {},
  'object-fit': {},
  'minmaxwh': {
    properties: ['min-width', 'max-width', 'min-height', 'max-height']
  },
  'text-stroke': {},
  'inline-block': {
    properties: ['display'],
    values: ['inline-block']
  },
  'css-grid': {},
  'rem': {
    properties: [''],
    values: ['rem']
  },
  'ttf': {},
  'pointer-events': {},
  'css-regions': {},
  'css-counters': {},
  'css-resize': {},
  'css-repeating-gradients': {},
  'getcomputedstyle': {},
  'word-break': {},
  'viewport-units': {},
  'style-scoped': {},
  'outline': {},
  'css3-cursors': {},
  'css-variables': {},
  'css-backgroundblendmode': {},
  'css-mixblendmode': {},
  'will-change': {},
  'css-shapes': {},
  'kerning-pairs-ligatures': {},
  'css-image-orientation': {},
  'css-appearance': {},
  'css-background-offsets': {},
  'css-touch-action': {},
  'css-clip-path': {},
  'font-loading': {},
  'font-unicode-range': {},
  'css-font-stretch': {},
  'font-size-adjust': {},
  'css-media-resolution': {},
  'css-image-set': {}
};