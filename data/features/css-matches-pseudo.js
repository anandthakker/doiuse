import { checkSelector } from '../../utils/util.js';

export default checkSelector([
  ':is',
  ':where',
  ':matches',
  ':any',
  ':-webkit-any',
  ':-webkit-is',
  ':-webkit-where',
  ':-webkit-matches',
]);
