import { readFile } from 'fs';
import { resolveFile } from '../file';

jest.mock('fs');

describe('resolveFile()', () => {
  it('works', async () => {
    ((readFile as unknown) as jest.Mock).mockImplementation((_, __, cb) => cb(undefined, 'root:*'));
    await expect(resolveFile({ path: () => '/etc/passwd' })).resolves.toEqual('root:*');
  });

  it('handles failures', async () => {
    ((readFile as unknown) as jest.Mock).mockImplementation((_, __, cb) => cb(new Error('Using shadow, ha, ha')));
    await expect(resolveFile({ path: () => '/etc/passwd' })).rejects.toThrowError('Using shadow, ha, ha');
  });
});
