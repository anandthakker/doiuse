import { checkSelector } from '../../utils/util.js';

const ATTRIBUTE_IDENTIFIER = '[^\\~|^$*\\]]*';

// Export for testing
export const REGEXES = {
  'SIBLING_SELECTOR': /^[^[]*~/,
  'STARTSWITH_ATTRIBUTE': new RegExp(`\\[${ATTRIBUTE_IDENTIFIER}\\^=${ATTRIBUTE_IDENTIFIER}\\]`),
  'ENDSWITH_ATTRIBUTE': new RegExp(`\\[${ATTRIBUTE_IDENTIFIER}\\$=${ATTRIBUTE_IDENTIFIER}\\]`),
  'INSENSITIVE_ATTRIBUTE': new RegExp(`\\[${ATTRIBUTE_IDENTIFIER}\\*=${ATTRIBUTE_IDENTIFIER}\\]`),
};

export default checkSelector([
  ':root',
  ':nth-child',
  ':nth-last-child',
  'nth-of-type',
  'nth-last-of-type',
  ':last-child',
  ':first-of-type',
  ':last-of-type',
  ':only-child',
  ':only-of-type',
  ':empty',
  ':target',
  ':enabled',
  ':disabled',
  ':checked',
  ':not',
  REGEXES.SIBLING_SELECTOR,
  REGEXES.STARTSWITH_ATTRIBUTE,
  REGEXES.ENDSWITH_ATTRIBUTE,
  REGEXES.INSENSITIVE_ATTRIBUTE,
]);
