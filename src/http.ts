import fetch, { RequestInit } from 'node-fetch';
import * as URI from 'urijs';

export class OpenError extends Error {
  public readonly name = 'OpenError';
}

export class NetworkError extends Error {
  public readonly name = 'ReadError';
}

export async function resolveHttp(ref: URI, opts: RequestInit = {}) {
  const uri = ref.href();
  const response = await fetch(uri, opts);
  if (response.ok) {
    return response.text();
  }

  if (response.status === 404) {
    throw new OpenError(`Page not found: ${uri}`);
  }

  throw new NetworkError(`${response.status} ${response.statusText}`);
}

export function createResolveHttp(defaultRequestOptions: RequestInit = {}): typeof resolveHttp {
  return ref => resolveHttp(ref, defaultRequestOptions);
}
