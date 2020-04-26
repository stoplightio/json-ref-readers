import { ResolverError, ResolverOptions } from '@apidevtools/json-schema-ref-parser';
import { isURL } from '@stoplight/path';
import { readFile } from 'fs';

const resolveFile: ResolverOptions = {
  order: 100,

  canRead(file) {
    return !isURL(file.url);
  },

  read(file) {
    return new Promise((resolve, reject) => {
      readFile(file.url, 'utf8', (err, data) => {
        if (err) {
          reject(new ResolverError(err, file.url));
        } else {
          resolve(data);
        }
      });
    });
  },
};

export { resolveFile as default };
