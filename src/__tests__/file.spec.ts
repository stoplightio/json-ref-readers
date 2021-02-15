import * as path from 'path';
import * as URI from 'urijs';
import { resolveFile } from '../file';

describe('resolveFile()', () => {
  it('works', async () => {
    const uri = new URI(path.join(__dirname, '__fixtures__/test.json'));
    await expect(resolveFile(uri)).resolves.toMatch(/^{\}/);
  });

  it('handles failures', async () => {
    const uri = new URI(path.join(__dirname, '__fixtures__/baz.json'));
    await expect(resolveFile(uri)).rejects.toThrowError();
  });
});
