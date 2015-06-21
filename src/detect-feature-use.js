var _ = require('lodash')
var features = require('../data/features')

/*
 * str: string to search in.
 * searchfor: string or pattern to search for.
 */
function isFoundIn (str) {
  return function find (searchfor) {
    if (searchfor instanceof RegExp) return searchfor.test(str)
    else if (_.isFunction(searchfor)) return searchfor(str)
    else return str && str.indexOf(searchfor) >= 0
  }
}

/*
 * postcss the use of any of a given list of CSS features.
 * ```
 * var detector = new Detector(featureList)
 * detector.process(css, cb)
 * ```
 *
 * `featureList`: an array of feature slugs (see caniuse-db)
 * `cb`: a callback that gets called for each usage of one of the given features,
 * called with an argument like:
 * ```
 * {
 *   usage: {} // postcss node where usage was found
 *   feature: {} // caniuse-db feature slug
 * }
 * ```
 */

module.exports = class Detector {
constructor (featureList) {
  this.features = _.pick(features, featureList)
}

decl (decl, cb) {
  for (let feat in this.features) {
    const properties = this.features[feat].properties || []
    const values = this.features[feat].values
    if (properties.filter(isFoundIn(decl.prop)).length > 0) {
      if (!values || values.filter(isFoundIn(decl.value)).length > 0) {
        cb({usage: decl, feature: feat})
      }
    }
  }
}

rule (rule, cb) {
  for (let feat in this.features) {
    const selectors = this.features[feat].selectors || []
    if (selectors.filter(isFoundIn(rule.selector)).length > 0) {
      cb({usage: rule, feature: feat})
    }
  }

  this.process(rule, cb)
}

atrule (atrule, cb) {
  for (let feat in this.features) {
    const atrules = this.features[feat].atrules || []
    const params = this.features[feat].params
    if (atrules.filter(isFoundIn(atrule.name)).length > 0) {
      if (!params || params.filter(isFoundIn(atrule.params)).length > 0) {
        cb({usage: atrule, feature: feat})
      }
    }
  }

  this.process(atrule, cb)
}

process (node, cb) {
  const self = this
  node.each((child) => {
    switch (child.type) {
      case 'rule':
        self.rule(child, cb)
        break
      case 'decl':
        self.decl(child, cb)
        break
      case 'atrule':
        self.atrule(child, cb)
        break
      case 'comment':
        break
      default:
        throw new Error('Unkonwn node type ' + child.type)
    }
  })
}
}
