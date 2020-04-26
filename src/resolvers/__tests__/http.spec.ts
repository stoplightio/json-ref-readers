import * as nock from 'nock';
import { createResolveHttp, resolveHttp } from '../';
import $RefParser = require('@apidevtools/json-schema-ref-parser');
import { ResolverError } from '@apidevtools/json-schema-ref-parser';

describe('resolveHttp()', () => {
  afterAll(() => {
    nock.cleanAll();
  });

  it('works', () => {
    nock('https://stoplight.io')
      .get('/')
      .reply(200, '{"bar":false}');

    const parser = new $RefParser();
    const deref = parser.dereference({ $ref: 'https://stoplight.io' }, {
      resolve: {
        http: resolveHttp,
      }
    });

    return expect(deref).resolves.toStrictEqual({ bar: false });
  });

  it('given a 404 network error, throws an error with different message', () => {
    nock('https://stoplight.io')
      .get('/')
      .reply(404);

    const parser = new $RefParser();
    const deref = parser.dereference({ $ref: 'https://stoplight.io' }, {
      resolve: {
        http: resolveHttp,
      }
    });

    return Promise.all([
      expect(deref).rejects.toThrow(ResolverError),
      expect(deref).rejects.toThrowError('Page not found: https://stoplight.io/'),
    ]);
  });

  it('given a network error, throws an error', () => {
    nock('https://stoplight.io')
      .get('/')
      .reply(500);

    const parser = new $RefParser();
    const deref = parser.dereference({ $ref: 'https://stoplight.io' }, {
      resolve: {
        http: resolveHttp,
      }
    });

    return Promise.all([
      expect(deref).rejects.toThrow(ResolverError),
      expect(deref).rejects.toThrowError('500 Internal Server Error'),
    ]);
  });
});

describe('createResolveHttp()', () => {
  afterAll(() => {
    nock.cleanAll();
  });

  it('allows to pass custom RequestInit', () => {
    nock('https://stoplight.io')
      .get('/')
      .basicAuth({ user: 'john', pass: 'doe' })
      .reply(200, '[]');

    const resolve = createResolveHttp({
      headers: { Authorization: `Basic ${Buffer.from('john:doe').toString('base64')}` },
    });

    const parser = new $RefParser();
    const deref = parser.dereference({ $ref: 'https://stoplight.io' }, {
      resolve: {
        http: resolve,
      }
    });

    return expect(deref).resolves.toStrictEqual([]);
  });
});
