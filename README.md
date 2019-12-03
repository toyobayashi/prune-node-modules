# prune-node-modules

## Install

```
npm install @tybys/prune-node-modules
```

## Usage

### JavaScript

``` js
const path = require('path')
const pnm = require('@tybys/prune-node-modules')

const input = path.join(__dirname)

pnm(input)
```

### TypeScript

``` ts
import * as path from 'path'
import * as pnm from '@tybys/prune-node-modules'

const input = path.join(__dirname)

pnm(input)
```

## API

### `pnm(input: string, options?: { whitelist?: string[]; removeFiles?: string[] }): void`

## License

MIT.
