import { JSONParserError, ParserError } from '@apidevtools/json-schema-ref-parser';
import { Dictionary, IDiagnostic, JsonPath } from '@stoplight/types';

// Vincenzo loves it.
type WritableJSONParserError = Dictionary<JSONParserError[keyof JSONParserError], keyof JSONParserError>;

export default class StoplightParserError extends ParserError {
  protected _path: JsonPath;
  protected _source: string;
  public errors: JSONParserError[];

  constructor(diagnostics: IDiagnostic[], source: string) {
    super(`Error parsing ${source}`, source);

    this._source = source;
    this._path = [];
    this.errors = diagnostics.filter(StoplightParserError.pickError).map(StoplightParserError.createParserError, this);
  }

  protected static createParserError(this: StoplightParserError, diagnostic: IDiagnostic) {
    const parserError = new ParserError(diagnostic.message, this.source);
    (parserError as WritableJSONParserError).message = diagnostic.message;
    return parserError;
  }

  protected static pickError(diagnostic: IDiagnostic) {
    return diagnostic.severity === 0;
  }

  public static hasErrors(diagnostics: IDiagnostic[]) {
    return diagnostics.some(StoplightParserError.pickError);
  }

  public get source() {
    return this._source;
  }

  public set source(source) {
    this._source = source;

    if (this.errors) {
      for (const error of this.errors) {
        (error as WritableJSONParserError).source = source;
      }
    }
  }

  public get path() {
    return this._path;
  }

  public set path(path) {
    this._path = path;

    if (this.errors) {
      for (const error of this.errors) {
        (error as WritableJSONParserError).path = path;
      }
    }
  }
}
