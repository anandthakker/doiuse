import { createRequire } from 'module';

import browserslist from 'browserslist';

import { formatBrowserName } from '../../utils/util.js';

import { convertMdnSupportToBrowsers } from './convertMdnBrowser.js';

const require = createRequire(import.meta.url);
/** @type {import('@mdn/browser-compat-data').CompatData} */
const bcd = require('@mdn/browser-compat-data');

/* browser compat data is littered with dangleys */
/* eslint-disable no-underscore-dangle */

/**
 * @typedef {Object} PartialSupport
 * @prop {boolean} ignorePartialSupport if true, the feature is fully supported in this use case and no warning should be shown
 * @prop {string} [partialSupportMessage] if the feature is not fully supported, a better warning message to be provided to the user
 */

/**
 * checks the MDN compatibility data for partial support of a CSS property
 * @param {string} propertyName the name of the property, e.g. 'display'
 * @param {string} propertyValue the value of the property, e.g. 'block'
 * @return {import('./convertMdnBrowser.js').MdnSupportData | false} information about the support of the property (or false if no information is available)
 */
export function checkProperty(propertyName, propertyValue) {
  const support = bcd.css.properties[propertyName];
  if (!support) return false;
  let needsManualChecking = false;

  // here's how we extract value names from the MDN data:
  // if the compat entry has no description, the support key is the css value
  // if the compat entry does have a description, extract css value names from <code> tags
  // if there's a description but no code tags, support needs to be checked manually (which is not implemented yet) so report as normal

  const compatEntries = Object.entries(support).map(([key, value]) => {
    if (!('__compat' in value)) return undefined; // ignore keys without compat data
    if (key === '__compat') return undefined; // ignore the base __compat key
    const hasDescription = value.__compat?.description;

    if (hasDescription) {
      const valueNames = value.__compat.description.match(/<code>(.*?)<\/code>/g)?.map((match) => match.replace(/<\/?code>/g, '')) ?? [];

      if (valueNames.length === 0) {
        needsManualChecking = true;
        return false;
      } // no code tags, needs manual checking

      return {
        values: valueNames,
        supportData: value.__compat.support,
      };
    }

    return {
      values: [key],
      supportData: value.__compat.support,
    };
  });

  const applicableCompatEntry = compatEntries.find((entry) => {
    if (entry === undefined) return false;
    if (entry === false) return false;
    if (entry.values.includes(propertyValue)) return true;
    return false;
  });

  if (applicableCompatEntry) {
    return convertMdnSupportToBrowsers(applicableCompatEntry.supportData);
  }

  // if there's no applicable entry, fall back on the default __compat entry and ignore the specific value
  if (!applicableCompatEntry && !needsManualChecking) {
    const defaultCompatEntry = support.__compat;
    if (!defaultCompatEntry) return false;
    return convertMdnSupportToBrowsers(defaultCompatEntry.support, true);
  }

  return false;
}

/**
 * checks a browser against the MDN compatibility data
 * @param {string} browser the name of the browser, e.g. 'chrome 89'
 * @param {import('./convertMdnBrowser.js').MdnSupportData} supportData the support data for the property
 * @return {boolean} true if the browser supports the property, false if not
 */
function checkBrowser(browser, supportData) {
  const browserName = browser.split(' ')[0];
  const browserSupport = supportData[browserName];

  if (!browserSupport) return false;

  const { versionAdded, versionRemoved = Number.POSITIVE_INFINITY } = browserSupport;

  const version = Number.parseFloat(browser.split(' ')[1]);

  if (version < versionAdded) return false;
  if (version > versionRemoved) return false;

  return true;
}

/**
 * checks MDN for more detailed information about a partially supported feature
 * in order to provide a more detailed warning message to the user
 * @param {import('postcss').ChildNode} node the node to check
 * @param {readonly string[] | string} browsers the browserslist query for browsers to support
 * @return {PartialSupport}
 */
export function checkPartialSupport(node, browsers) {
  const browsersToCheck = browserslist(browsers);
  if (node.type === 'decl') {
    const supportData = checkProperty(node.prop, node.value);
    if (!supportData) return { ignorePartialSupport: false };
    const unsupportedBrowsers = browsersToCheck.filter((browser) => !checkBrowser(browser, supportData));

    if (unsupportedBrowsers.length === 0) {
      return {
        ignorePartialSupport: true,
      };
    }

    /** @type {Record<string, string[]>} */
    const browserVersions = {};
    for (const browser of unsupportedBrowsers) {
      const [browserName, browserVersion] = browser.split(' ');
      if (!browserVersions[browserName]) browserVersions[browserName] = [];
      browserVersions[browserName].push(browserVersion);
    }

    const formattedUnsupportedBrowsers = Object.entries(browserVersions)
      .map(([browserName, versions]) => formatBrowserName(browserName, versions));

    // check if the value matters
    if (Object.values(supportData).some((data) => data.ignoreValue)) {
      return {
        ignorePartialSupport: false,
        partialSupportMessage: `${node.prop} is not supported by: ${formattedUnsupportedBrowsers.join(', ')}`,
      };
    }

    return {
      ignorePartialSupport: false,
      partialSupportMessage: `value of ${node.value} is not supported by: ${formattedUnsupportedBrowsers.join(', ')}`,
    };
  }

  return {
    ignorePartialSupport: false,
  };
}
