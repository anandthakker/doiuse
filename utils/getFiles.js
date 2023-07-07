import { readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

/**
 * recursively get all files in a directory
 * @param {string} directory the directory to read
 * @yields {string} the path to each file
 * @return {AsyncGenerator<string>} the path to each file
 */
export async function* getFiles(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      yield* getFiles(path);
    } else {
      yield path;
    }
  }
}
