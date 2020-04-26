import { ResolverError, ResolverOptions } from '@apidevtools/json-schema-ref-parser';
import { isURL } from '@stoplight/path';
import fetch, { RequestInit } from 'node-fetch';

export default (opts: RequestInit = {}): ResolverOptions => ({
  order: 200,

  canRead(file) {
    return isURL(file.url);
  },

  async read(file) {
    try {
      const response = await fetch(file.url, opts);
      if (response.ok) {
        return await response.text();
      }

      if (response.status === 404) {
        throw new Error(`Page not found: ${file.url}`);
      }

      throw new Error(`${response.status} ${response.statusText}`);
    } catch (ex) {
      throw new ResolverError(ex, file.url);
    }
  },
});
