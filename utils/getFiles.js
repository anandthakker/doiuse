import { readdir } from 'fs/promises';
import { resolve } from 'path';

/**
 * recursively get all files in a directory
 * @param {string} dir the directory to read
 * @yields {string} the path to each file
 */
export async function* getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}
