import { readFile } from 'fs';
import * as URI from 'urijs';

export function resolveFile(ref: URI) {
  return new Promise((resolve, reject) => {
    const path = ref.path();
    readFile(path, 'utf8', (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}
