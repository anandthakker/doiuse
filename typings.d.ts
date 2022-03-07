import features from './data/Features.js';

/** @typedef {string|((s:string)=>boolean)|RegExp} FeatureValue */

export global {
  export type FEATURES = typeof features;
}
