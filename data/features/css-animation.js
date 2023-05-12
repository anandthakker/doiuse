export default {
  'animation': true,
  'animation-name': true,
  'animation-duration': true,
  'animation-timing-function': true,
  'animation-iteration-count': true,
  'animation-direction': true,
  'animation-play-state': true,
  'animation-delay': true,
  'animation-fill-mode': true,
};

// @keyframes isn't checked for, but if you try to use it,
// you'll still get a warning anyway because of the 'animation' property
