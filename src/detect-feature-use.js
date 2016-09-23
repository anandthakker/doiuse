var _ = require('lodash')
var features = require('../data/features')

const PLUGIN_OPTION_COMMENT = 'doiuse-'
const DISABLE_FEATURE_COMMENT = PLUGIN_OPTION_COMMENT + 'disable'
const ENABLE_FEATURE_COMMENT = PLUGIN_OPTION_COMMENT + 'enable'

/*
 * str: string to search in.
 * searchfor: string or pattern to search for.
 */
function isFoundIn (str) {
  str = stripUrls(str)
  return function find (searchfor) {
    if (searchfor instanceof RegExp) return searchfor.test(str)
    else if (_.isFunction(searchfor)) return searchfor(str)
    else return str && str.indexOf(searchfor) >= 0
  }
}

/*
 * Strip the contents of url literals so they aren't matched
 * by our naive substring matching.
 */
function stripUrls (str) {
  return str.replace(/url\([^\)]*\)/g, 'url()')
}

/**
 * Detect the use of any of a given list of CSS features.
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
 *   ignore: {} // caniuse-db feature to ignore in current file
 * }
 * ```
 */
module.exports = class Detector {
  constructor (featureList) {
    this.features = _.pick(features, featureList)
    this.ignore = []
  }

  decl (decl, cb) {
    for (let feat in this.features) {
      const properties = this.features[feat].properties || []
      const values = this.features[feat].values
      if (properties.filter(isFoundIn(decl.prop)).length > 0) {
        if (!values || values.filter(isFoundIn(decl.value)).length > 0) {
          cb({usage: decl, feature: feat, ignore: this.ignore})
        }
      }
    }
  }

  rule (rule, cb) {
    for (let feat in this.features) {
      const selectors = this.features[feat].selectors || []
      if (selectors.filter(isFoundIn(rule.selector)).length > 0) {
        cb({usage: rule, feature: feat, ignore: this.ignore})
      }
    }

    this.node(rule, cb)
  }

  atrule (atrule, cb) {
    for (let feat in this.features) {
      const atrules = this.features[feat].atrules || []
      const params = this.features[feat].params
      if (atrules.filter(isFoundIn(atrule.name)).length > 0) {
        if (!params || params.filter(isFoundIn(atrule.params)).length > 0) {
          cb({usage: atrule, feature: feat, ignore: this.ignore})
        }
      }
    }

    this.node(atrule, cb)
  }

  comment (comment, cb) {
    const text = comment.text.toLowerCase()

    if (_.startsWith(text, PLUGIN_OPTION_COMMENT)) {
      const option = text.split(' ', 1)[0]
      const value = text.replace(option, '').trim()

      switch (option) {
        case DISABLE_FEATURE_COMMENT:
          if (value === '') {
            this.ignore = _.keysIn(this.features)
          } else {
            this.ignore = _.uniq([...this.ignore, ...value.split(',').map((feat) => feat.trim())])
          }
          break
        case ENABLE_FEATURE_COMMENT:
          if (value === '') {
            this.ignore = []
          } else {
            this.ignore = _.without(this.ignore, ...value.split(',').map((feat) => feat.trim()))
          }
          break
      }
    }
  }

  node (node, cb) {
    node.each((child) => {
      switch (child.type) {
        case 'rule':
          this.rule(child, cb)
          break
        case 'decl':
          this.decl(child, cb)
          break
        case 'atrule':
          this.atrule(child, cb)
          break
        case 'comment':
          this.comment(child, cb)
          break
        default:
          throw new Error('Unkonwn node type ' + child.type)
      }
    })
  }

  process (node, cb) {
//  Reset ignoring rules specified by inline comments per each file
    this.ignore = []

//  Recursively walk nodes in file
    this.node(node, cb)
  }
}
