import fetch from 'node-fetch';
import { resolveHttp } from '../http';

jest.mock('node-fetch');

describe('resolveHttp()', () => {
  it('works', async () => {
    ((fetch as unknown) as jest.Mock).mockImplementation(() => ({ text: jest.fn(() => 'test') }));
    await expect(resolveHttp('http://stoplight.io')).resolves.toEqual('test');
  });
});
