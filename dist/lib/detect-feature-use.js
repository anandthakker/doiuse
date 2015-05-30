'use strict'

var _createClass = (function () { function defineProperties (target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })()

function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ = require('lodash')
var features = require('../data/features')

/*
 * str: string to search in.
 * searchfor: string or pattern to search for.
 */
function isFoundIn (str) {
  return function find (searchfor) {
    if (searchfor instanceof RegExp) return searchfor.test(str);else if (_.isFunction(searchfor)) return searchfor(str);else return str && str.indexOf(searchfor) >= 0
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

module.exports = (function () {
  function Detector (featureList) {
    _classCallCheck(this, Detector)

    this.features = _.pick(features, featureList)
  }

  _createClass(Detector, [{
    key: 'decl',
    value: function decl (decl, cb) {
      for (var feat in this.features) {
        var properties = this.features[feat].properties || []
        var values = this.features[feat].values
        if (properties.filter(isFoundIn(decl.prop)).length > 0) {
          if (!values || values.filter(isFoundIn(decl.value)).length > 0) {
            cb({ usage: decl, feature: feat })
          }
        }
      }
    }
  }, {
    key: 'rule',
    value: function rule (rule, cb) {
      for (var feat in this.features) {
        var selectors = this.features[feat].selectors || []
        if (selectors.filter(isFoundIn(rule.selector)).length > 0) {
          cb({ usage: rule, feature: feat })
        }
      }

      this.process(rule, cb)
    }
  }, {
    key: 'atrule',
    value: function atrule (atrule, cb) {
      for (var feat in this.features) {
        var atrules = this.features[feat].atrules || []
        var params = this.features[feat].params
        if (atrules.filter(isFoundIn(atrule.name)).length > 0) {
          if (!params || params.filter(isFoundIn(atrule.params)).length > 0) {
            cb({ usage: atrule, feature: feat })
          }
        }
      }

      this.process(atrule, cb)
    }
  }, {
    key: 'process',
    value: function process (node, cb) {
      var self = this
      node.each(function (child) {
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
  }])

  return Detector
})()
