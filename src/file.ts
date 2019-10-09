import { readFile } from 'fs';

export function resolveFile(ref: any) {
  return new Promise((resolve, reject) => {
    const path = ref.path();
    readFile(path, 'utf8', (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}
