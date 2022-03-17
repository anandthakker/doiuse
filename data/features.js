import backgroundImgOpts from './features/background-img-opts.js';
import backgroundPositionXY from './features/background-position-x-y.js';
import borderImage from './features/border-image.js';
import borderRadius from './features/border-radius.js';
import calc from './features/calc.js';
import cssAll from './features/css-all.js';
import cssAnimation from './features/css-animation.js';
import cssAnyLink from './features/css-any-link.js';
import cssAppearance from './features/css-appearance.js';
import cssAtCounterStyle from './features/css-at-counter-style.js';
import cssAutofill from './features/css-autofill.js';
import cssBackdropFilter from './features/css-backdrop-filter.js';
import cssBackgroundOffsets from './features/css-background-offsets.js';
import cssBackgroundblendmode from './features/css-backgroundblendmode.js';
import cssBoxshadow from './features/css-boxshadow.js';
import cssCanvas from './features/css-canvas.js';
import cssClipPath from './features/css-clip-path.js';
import cssCounters from './features/css-counters.js';
import cssEnvFunction from './features/css-env-function.js';
import cssFeaturequeries from './features/css-featurequeries.js';
import cssFilters from './features/css-filters.js';
import cssFixed from './features/css-fixed.js';
import cssFontStretch from './features/css-font-stretch.js';
import cssGencontent from './features/css-gencontent.js';
import cssGradients from './features/css-gradients.js';
import cssGrid from './features/css-grid.js';
import cssHyphens from './features/css-hyphens.js';
import cssImageOrientation from './features/css-image-orientation.js';
import cssImageSet from './features/css-image-set.js';
import cssInitialValue from './features/css-initial-value.js';
import cssLogicalProps from './features/css-logical-props.js';
import cssMasks from './features/css-masks.js';
import cssMediaResolution from './features/css-media-resolution.js';
import cssMediaqueries from './features/css-mediaqueries.js';
import cssMixblendmode from './features/css-mixblendmode.js';
import cssOpacity from './features/css-opacity.js';
import cssOverflowOverlay from './features/css-overflow-overlay.js';
import cssOverscrollBehavior from './features/css-overscroll-behavior.js';
import cssPlaceholder from './features/css-placeholder.js';
import cssReflections from './features/css-reflections.js';
import cssRepeatingGradients from './features/css-repeating-gradients.js';
import cssResize from './features/css-resize.js';
import cssRevertValue from './features/css-revert-value.js';
import cssScrollbar from './features/css-scrollbar.js';
import cssSel2 from './features/css-sel2.js';
import cssSel3 from './features/css-sel3.js';
import cssSelection from './features/css-selection.js';
import cssShapes from './features/css-shapes.js';
import cssSticky from './features/css-sticky.js';
import cssTable from './features/css-table.js';
import cssTextshadow from './features/css-textshadow.js';
import cssTouchAction from './features/css-touch-action.js';
import cssTransitions from './features/css-transitions.js';
import cssUnsetValue from './features/css-unset-value.js';
import cssVariables from './features/css-variables.js';
import css3Boxsizing from './features/css3-boxsizing.js';
import css3Colors from './features/css3-colors.js';
import css3CursorsGrab from './features/css3-cursors-grab.js';
import css3CursorsNewer from './features/css3-cursors-newer.js';
import css3Cursors from './features/css3-cursors.js';
import css3Tabsize from './features/css3-tabsize.js';
import flexbox from './features/flexbox.js';
import fontFeature from './features/font-feature.js';
import fontSizeAdjust from './features/font-size-adjust.js';
import fontUnicodeRange from './features/font-unicode-range.js';
import fontface from './features/fontface.js';
import fullscreen from './features/fullscreen.js';
import inlineBlock from './features/inline-block.js';
import intrinsicWidth from './features/intrinsic-width.js';
import kerningPairsLigatures from './features/kerning-pairs-ligatures.js';
import minmaxwh from './features/minmaxwh.js';
import multibackgrounds from './features/multibackgrounds.js';
import multicolumn from './features/multicolumn.js';
import objectFit from './features/object-fit.js';
import outline from './features/outline.js';
import pointerEvents from './features/pointer-events.js';
import pointer from './features/pointer.js';
import rem from './features/rem.js';
import textDecoration from './features/text-decoration.js';
import textOverflow from './features/text-overflow.js';
import textSizeAdjust from './features/text-size-adjust.js';
import transforms2d from './features/transforms2d.js';
import transforms3d from './features/transforms3d.js';
import userSelectNone from './features/user-select-none.js';
import viewportUnits from './features/viewport-units.js';
import willChange from './features/will-change.js';
import wordBreak from './features/word-break.js';
import wordwrap from './features/wordwrap.js';

/** @typedef {RegExp|string|((value:string) => boolean)} FeatureCheck */

/** @typedef {((rule:import('postcss').ChildNode) => boolean)} RuleCheck */

/** @typedef {Record<string, FeatureCheck|FeatureCheck[]|boolean> | RuleCheck | RuleCheck[]} Feature */

/** @enum {Feature} */
const FEATURES = {
  'background-img-opts': backgroundImgOpts,
  'background-position-x-y': backgroundPositionXY,
  'border-image': borderImage,
  'border-radius': borderRadius,
  'calc': calc,
  'css-all': cssAll,
  'css-animation': cssAnimation,
  'css-any-link': cssAnyLink,
  'css-appearance': cssAppearance,
  'css-at-counter-style': cssAtCounterStyle,
  'css-autofill': cssAutofill,
  'css-backdrop-filter': cssBackdropFilter,
  'css-background-offsets': cssBackgroundOffsets,
  'css-backgroundblendmode': cssBackgroundblendmode,
  'css-boxshadow': cssBoxshadow,
  'css-canvas': cssCanvas,
  'css-clip-path': cssClipPath,
  'css-counters': cssCounters,
  'css-env-function': cssEnvFunction,
  'css-featurequeries': cssFeaturequeries,
  'css-filters': cssFilters,
  'css-fixed': cssFixed,
  'css-font-stretch': cssFontStretch,
  'css-gencontent': cssGencontent,
  'css-gradients': cssGradients,
  'css-grid': cssGrid,
  'css-hyphens': cssHyphens,
  'css-image-orientation': cssImageOrientation,
  'css-image-set': cssImageSet,
  'css-initial-value': cssInitialValue,
  'css-logical-props': cssLogicalProps,
  'css-masks': cssMasks,
  'css-media-resolution': cssMediaResolution,
  'css-mediaqueries': cssMediaqueries,
  'css-mixblendmode': cssMixblendmode,
  'css-opacity': cssOpacity,
  'css-overflow-overlay': cssOverflowOverlay,
  'css-overscroll-behavior': cssOverscrollBehavior,
  'css-placeholder': cssPlaceholder,
  'css-reflections': cssReflections,
  'css-repeating-gradients': cssRepeatingGradients,
  'css-resize': cssResize,
  'css-revert-value': cssRevertValue,
  'css-scrollbar': cssScrollbar,
  'css-sel2': cssSel2,
  'css-sel3': cssSel3,
  'css-selection': cssSelection,
  'css-shapes': cssShapes,
  'css-sticky': cssSticky,
  'css-table': cssTable,
  'css-textshadow': cssTextshadow,
  'css-touch-action': cssTouchAction,
  'css-transitions': cssTransitions,
  'css-unset-value': cssUnsetValue,
  'css-variables': cssVariables,
  'css3-boxsizing': css3Boxsizing,
  'css3-colors': css3Colors,
  'css3-cursors-grab': css3CursorsGrab,
  'css3-cursors-newer': css3CursorsNewer,
  'css3-cursors': css3Cursors,
  'css3-tabsize': css3Tabsize,
  'flexbox': flexbox,
  'font-feature': fontFeature,
  'font-size-adjust': fontSizeAdjust,
  'font-unicode-range': fontUnicodeRange,
  'fontface': fontface,
  'fullscreen': fullscreen,
  'inline-block': inlineBlock,
  'intrinsic-width': intrinsicWidth,
  'kerning-pairs-ligatures': kerningPairsLigatures,
  'minmaxwh': minmaxwh,
  'multibackgrounds': multibackgrounds,
  'multicolumn': multicolumn,
  'object-fit': objectFit,
  'outline': outline,
  'pointer-events': pointerEvents,
  'pointer': pointer,
  'rem': rem,
  'text-decoration': textDecoration,
  'text-overflow': textOverflow,
  'text-size-adjust': textSizeAdjust,
  'transforms2d': transforms2d,
  'transforms3d': transforms3d,
  'user-select-none': userSelectNone,
  'viewport-units': viewportUnits,
  'will-change': willChange,
  'word-break': wordBreak,
  'wordwrap': wordwrap,
};

/** @typedef {keyof typeof FEATURES} FeatureKeys */

export default /** @type {{[K in FeatureKeys]: Feature}} */ (FEATURES);
