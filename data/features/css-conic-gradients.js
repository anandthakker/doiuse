const REGEX = /(^|[^-])(repeating-)?conic-gradient/;

export default {
  'background': REGEX,
  'background-image': REGEX,
  'border-image': REGEX,
  'border-image-source': REGEX,
  'content': REGEX,
  'cursor': REGEX,
  'list-style': REGEX,
  'list-style-image': REGEX,
};
