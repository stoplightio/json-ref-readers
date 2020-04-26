import { readFile } from 'fs';
import $RefParser = require('@apidevtools/json-schema-ref-parser');
import { yamlParser } from '../index';
import { resolveFile } from '../../resolvers';

jest.mock('fs');

describe('YAML Parser', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('works', async () => {
    ((readFile as unknown) as jest.Mock).mockImplementation((_path, _opts, cb) => cb(null, '{"foo":true}'));

    const parser = new $RefParser();
    const deref = parser.dereference({ $ref: './baz.yaml' }, {
      resolve: {
        file: resolveFile,
      },
      parse: {
        yaml: yamlParser,
      }
    });

    return expect(deref).resolves.toStrictEqual({ foo: true });
  });

  it('retains the order of keys', async () => {
    ((readFile as unknown) as jest.Mock).mockImplementation((_path, _opts, cb) => cb(null, '{"foo":true,"0": false}'));

    const parser = new $RefParser();
    const deref = await parser.dereference({ $ref: './baz.yaml' }, {
      resolve: {
        file: resolveFile,
      },
      parse: {
        yaml: yamlParser,
      }
    });

    expect(Object.keys(deref)).toEqual(['foo', '0'])
  });

  it('handles failures', async () => {
    ((readFile as unknown) as jest.Mock).mockImplementation((_path, _opts, cb) => cb(null, 'foo:\n d\na'));

    const parser = new $RefParser();
    const deref = parser.dereference({ $ref: './baz.yaml' }, {
      resolve: {
        file: resolveFile,
      },
      parse: {
        yaml: yamlParser,
      }
    });

    return expect(deref).rejects.toThrow($RefParser.ParserError);
  });

  it('integrates with continueOnError',  () => {
    ((readFile as unknown) as jest.Mock).mockImplementation((_path, _opts, cb) => cb(null, 'foo:\n d\na'));

    const parser = new $RefParser();
    const deref = parser.dereference({ $ref: './baz.yaml' }, {
      resolve: {
        file: resolveFile,
      },
      parse: {
        yaml: yamlParser,
      },
      continueOnError: true,
    });

    return Promise.all([
      expect(deref).rejects.toThrow($RefParser.JSONParserErrorGroup),
      expect(deref).rejects.toHaveProperty('errors', [
        expect.objectContaining({ name: 'ParserError', message: 'can not read a block mapping entry; a multiline key may not be an implicit key' }),
        expect.objectContaining({ name: 'ParserError', message: 'can not read an implicit mapping pair; a colon is missed' }),
      ]),
    ]);
  })
});
