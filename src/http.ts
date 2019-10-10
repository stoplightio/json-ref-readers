import fetch from 'node-fetch';

export async function resolveHttp(ref: uri.URI) {
  const response = await fetch(String(ref));
  return response.text();
}
