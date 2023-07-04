import { checkSelector } from '../../utils/util.js';

const ATTRIBUTE_IDENTIFIER = '[^\\~|^$*\\]]*';

// Export for testing
export const REGEXES = {
  'HAS_ATTRIBUTE': new RegExp(`\\[${ATTRIBUTE_IDENTIFIER}\\]`),
  'MATCH_ATTRIBUTE': new RegExp(`\\[${ATTRIBUTE_IDENTIFIER}=${ATTRIBUTE_IDENTIFIER}\\]`),
  'WORD_ATTRIBUTE': new RegExp(`\\[${ATTRIBUTE_IDENTIFIER}\\~=${ATTRIBUTE_IDENTIFIER}\\]`),
  'SUBCODE_ATTRIBUTE': new RegExp(`\\[${ATTRIBUTE_IDENTIFIER}\\|=${ATTRIBUTE_IDENTIFIER}\\]`),
  'BRACKET_PARENS': /(\[[^=\]]*(=("[^"]*")|[^\]]+|)])|(\([^)]*\))/g,
};

/**
 * @param {RegExp} pattern
 * @return {(str:string) => boolean}
 */
function matchOutsideOfBrackets(pattern) {
  if (!(pattern instanceof RegExp)) {
    throw new TypeError('matchOutsideOfBrackets expects a RegExp');
  }
  return (string) => pattern.test(string.replaceAll(REGEXES.BRACKET_PARENS, ''));
}

export default checkSelector([
  ':first-child',
  ':link',
  ':visited',
  ':active',
  ':hover',
  ':focus',
  ':lang',
  REGEXES.HAS_ATTRIBUTE,
  REGEXES.MATCH_ATTRIBUTE,
  REGEXES.WORD_ATTRIBUTE,
  REGEXES.SUBCODE_ATTRIBUTE,
  matchOutsideOfBrackets(/\*/),
  matchOutsideOfBrackets(/>/),
  matchOutsideOfBrackets(/\+/),
  matchOutsideOfBrackets(/\./),
  matchOutsideOfBrackets(/#/),
]);
