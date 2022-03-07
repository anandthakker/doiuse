import { agents } from 'caniuse-lite';

/**
 * @param {string} browserKey
 * @param {string[]} [versions]
 * @return {string}
 */
export function formatBrowserName(browserKey, versions) {
  const browserName = agents[browserKey]?.browser ?? '';
  if (!versions) {
    return browserName;
  }
  return (`${browserName} (${versions.join(',')})`);
}
