import { readFile } from 'fs';
import $RefParser = require('@apidevtools/json-schema-ref-parser');
import { jsonParser } from '../index';
import { resolveFile } from '../../resolvers';

jest.mock('fs');

describe('JSON Parser', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('works', async () => {
    ((readFile as unknown) as jest.Mock).mockImplementation((_path, _opts, cb) => cb(null, '{"foo":true}'));

    const parser = new $RefParser();
    const deref = parser.dereference({ $ref: './baz.json' }, {
      resolve: {
        file: resolveFile,
      },
      parse: {
        json: jsonParser,
        yaml: false,
      }
    });

    return expect(deref).resolves.toStrictEqual({ foo: true });
  });

  it('retains the order of keys', async () => {
    ((readFile as unknown) as jest.Mock).mockImplementation((_path, _opts, cb) => cb(null, '{"foo":true,"0": false}'));

    const parser = new $RefParser();
    const deref = await parser.dereference({ $ref: './baz.json' }, {
      resolve: {
        file: resolveFile,
      },
      parse: {
        json: jsonParser,
        yaml: false,
      }
    });

    expect(Object.keys(deref)).toEqual(['foo', '0'])
  });

  it('handles failures', async () => {
    ((readFile as unknown) as jest.Mock).mockImplementation((_path, _opts, cb) => cb(null, '{bar zx;cxz"":true}'));

    const parser = new $RefParser();
    const deref = parser.dereference({ $ref: './baz.json' }, {
      resolve: {
        file: resolveFile,
      },
      parse: {
        json: jsonParser,
        yaml: false,
      }
    });

    return expect(deref).rejects.toThrow($RefParser.ParserError);
  });

  it('integrates with continueOnError',  () => {
    ((readFile as unknown) as jest.Mock).mockImplementation((_path, _opts, cb) => cb(null, '{"foo": true,}'));

    const parser = new $RefParser();
    const deref = parser.dereference({ $ref: './baz.json' }, {
      resolve: {
        file: resolveFile,
      },
      parse: {
        json: jsonParser,
        yaml: false,
      },
      continueOnError: true,
    });

    return Promise.all([
      expect(deref).rejects.toThrow($RefParser.JSONParserErrorGroup),
      expect(deref).rejects.toHaveProperty('errors', [
        expect.objectContaining({ name: 'ParserError', message: 'PropertyNameExpected' }),
        expect.objectContaining({ name: 'ParserError', message: 'ValueExpected' }),
      ]),
    ]);
  })
});
