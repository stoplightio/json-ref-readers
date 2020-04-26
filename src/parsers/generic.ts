import { ParserOptions } from '@apidevtools/json-schema-ref-parser';
import { IParserResult } from '@stoplight/types';
import StoplightParserError from './error';

export declare type Parser<T = any> = (
  value: string,
  options: Partial<{ preserveKeyOrder: boolean }>,
) => IParserResult<T, any, unknown, unknown>;

export default (parse: Parser, order: number, canParse: string[]): ParserOptions => ({
  allowEmpty: true,
  order,
  canParse,
  async parse(file) {
    let data = file.data;
    if (Buffer.isBuffer(data)) {
      data = data.toString();
    }

    if (typeof data === 'string') {
      if (data.trim().length === 0) {
        return;
      } else {
        const result = parse(data, { preserveKeyOrder: true });

        if (StoplightParserError.hasErrors(result.diagnostics)) {
          throw new StoplightParserError(result.diagnostics, file.url);
        }

        return result.data;
      }
    } else {
      return data;
    }
  },
});
