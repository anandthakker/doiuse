import { checkAtRule, performFeatureCheck } from '../../utils/util.js';

export default [
  (rule) => performFeatureCheck('font-palette', rule.name),
  checkAtRule('font-palette-values'),
];
