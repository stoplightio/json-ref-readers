import * as nock from 'nock';
import * as URI from 'urijs';
import { createResolveHttp, NetworkError, OpenError, resolveHttp } from '../http';

describe('resolveHttp()', () => {
  afterAll(() => {
    nock.cleanAll();
  });

  it('works', () => {
    nock('https://stoplight.io')
      .get('/')
      .reply(200, 'test');

    return expect(resolveHttp(new URI('http://stoplight.io'))).resolves.toEqual('test');
  });

  it('given a 404 network error, throws OpenError', () => {
    nock('https://stoplight.io')
      .get('/')
      .reply(404);

    return expect(resolveHttp(new URI('http://stoplight.io'))).rejects.toStrictEqual(
      new OpenError('Page not found: http://stoplight.io/'),
    );
  });

  it('given a network error, throws NetworkError', () => {
    nock('https://stoplight.io')
      .get('/')
      .reply(500);

    return expect(resolveHttp(new URI('http://stoplight.io'))).rejects.toStrictEqual(
      new NetworkError('500 Internal Server Error'),
    );
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
      .reply(200, 'test');

    const resolve = createResolveHttp({
      headers: { Authorization: `Basic ${Buffer.from('john:doe').toString('base64')}` },
    });

    return expect(resolve(new URI('http://stoplight.io'))).resolves.toEqual('test');
  });
});
