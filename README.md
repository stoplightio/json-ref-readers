# ref-resolvers
Set of utilities for resolving external json references.

## Installation

```bash
yarn add @stoplight/ref-resolvers
```

## Usage

The library exports two functions: `resolveHttp` and `resolveFile`. Both take `uri.URI` and resolve to a string containing requested resource.

```ts
import { Resolver } from '@stoplight/json-ref-resolver';
import { resolveFile, resolveHttp } from '@stoplight/ref-resolvers';

const httpAndFileResolver = new Resolver({
  resolvers: {
    https: { resolve: resolveHttp },
    http: { resolve: resolveHttp },
    file: { resolve: resolveFile },
  },
});
```
