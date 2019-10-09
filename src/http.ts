import fetch from 'node-fetch';

export async function resolveHttp(ref: unknown) {
  const response = await fetch(String(ref));
  return response.text();
}
