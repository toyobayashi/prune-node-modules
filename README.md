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

``` ts
declare namespace pnm {
  export interface PruneOptions {
    whitelist?: string[] // merge
    removeFiles?: string[] // overwrite
    removeDirs?: string[] // overwrite
    production?: boolean // .js .json .node .wasm only
  }
}

declare function pnm (dir: string, options?: PruneOptions): void

export = pnm
```

## License

MIT.
