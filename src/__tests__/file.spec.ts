import { readFile } from 'fs';
import { resolveFile } from '../file';
import * as URI from 'urijs';

jest.mock('fs');

describe('resolveFile()', () => {
  it('works', async () => {
    ((readFile as unknown) as jest.Mock).mockImplementation((_, __, cb) => cb(undefined, 'root:*'));
    await expect(resolveFile({ path: () => '/etc/passwd' } as URI)).resolves.toEqual('root:*');
  });

  it('handles failures', async () => {
    ((readFile as unknown) as jest.Mock).mockImplementation((_, __, cb) => cb(new Error('Using shadow, ha, ha')));
    await expect(resolveFile({ path: () => '/etc/passwd' } as URI)).rejects.toThrowError('Using shadow, ha, ha');
  });
});
