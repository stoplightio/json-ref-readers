import { readFile } from 'fs';
import { resolveFile } from '../';
import $RefParser = require('@apidevtools/json-schema-ref-parser');

jest.mock('fs');

describe('resolveFile()', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('works', async () => {
    ((readFile as unknown) as jest.Mock).mockImplementation((_path, _opts, cb) => cb(null, '{"foo":true}'));

    const parser = new $RefParser();
    const deref = parser.dereference({ $ref: './baz'}, {
      resolve: {
        file: resolveFile,
      }
    });

    return expect(deref).resolves.toStrictEqual({ foo: true });
  });

  it('handles failures', async () => {
    ((readFile as unknown) as jest.Mock).mockImplementation((_path,_opts, cb) => cb(new Error('Using shadow, ha, ha')));

    const parser = new $RefParser();
    const deref = parser.dereference({ $ref: './baz'}, {
      resolve: {
        file: resolveFile,
      }
    });

    return expect(deref).rejects.toThrow($RefParser.ResolverError);
  });
});
