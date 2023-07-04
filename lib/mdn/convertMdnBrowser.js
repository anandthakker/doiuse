/**
 * @typedef {Record<string, {
 *   versionAdded: number;
 *   versionRemoved?: number;
 *   ignoreValue?: boolean;
 * }>} MdnSupportData
 */

/**
 * converts browser names from MDN to caniuse
 * @param {string} browser
 */
function convertMdnBrowser(browser) {
  if (browser === 'samsunginternet_android') {
    return 'samsung';
  } if (browser === 'safari_ios') {
    return 'ios_saf';
  } if (browser === 'opera_android') {
    return 'op_mob';
  } if (browser === 'chrome_android') {
    return 'and_chr';
  } if (browser === 'firefox_android') {
    return 'and_ff';
  } if (browser === 'webview_android') {
    return 'android';
  }

  return browser;
}

/**
 *
 * @param {string | boolean} version the version string from MDN
 * @return {number} as a number
 */
function mdnVersionToNumber(version) {
  // sometimes the version is 'true', which means support is old
  if (version === true) {
    return 0;
  }
  // sometimes the version is 'false', which means support is not yet implemented
  if (version === false) {
    return Number.POSITIVE_INFINITY;
  }

  return Number.parseFloat(version);
}

/**
 *
 * convert raw MDN data to a format the uses caniuse browser names and real numbers
 * @param {import("@mdn/browser-compat-data").SupportBlock} supportData
 * @param {boolean} ignoreValue is this warning about a specific value, or the property in general?
 * @return {MdnSupportData} browsers
 */
export function convertMdnSupportToBrowsers(supportData, ignoreValue = false) {
  /**
   * @type {MdnSupportData}
   */
  const browsers = {};

  /**
   *
   * @param {string} browser
   * @param {import("@mdn/browser-compat-data").SimpleSupportStatement} data
   */
  const addToBrowsers = (browser, data) => {
    // TODO handle prefixes and alternative names
    if (data.alternative_name) return;
    if (data.prefix) return;
    if (data.partial_implementation) return;
    if (data.flags) return;

    if (data.version_added) {
      browsers[browser] = {
        versionAdded: mdnVersionToNumber(data.version_added),
        ignoreValue,
      };
    }

    if (data.version_removed) {
      browsers[browser].versionRemoved = mdnVersionToNumber(data.version_removed);
    }
  };

  Object.entries(supportData).forEach(([browser, data]) => {
    const caniuseBrowser = convertMdnBrowser(browser);

    if (Array.isArray(data)) {
      data.forEach((d) => {
        addToBrowsers(caniuseBrowser, d);
      });
    } else { addToBrowsers(caniuseBrowser, data); }
  });

  return browsers;
}
