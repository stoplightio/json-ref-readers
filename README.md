# json-ref-readers
Set of utilities for reading external json references.

## Installation

```bash
yarn add @stoplight/json-ref-readers
```

## Usage

```ts
import $RefParser from '@apidevtools/json-schema-ref-parser';
import { jsonParser, yamlParser } from '@stoplight/json-ref-readers';

const parser = new $RefParser();

parser.dereference(filePath, {
  parse: {
    json: jsonParser,
    yaml: yamlParser,
  },
});
```
