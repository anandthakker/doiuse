import { agents } from 'caniuse-lite';

/**
 * @param {string} browserKey
 * @param {string[]} [versions]
 * @return {string}
 */
export function formatBrowserName(browserKey, versions) {
  const entry = agents[browserKey];
  const browserName = entry ? entry.browser : null;
  if (!versions) {
    return browserName || '';
  }
  return (`${browserName} (${versions.join(',')})`);
}
