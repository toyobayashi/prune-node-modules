# prune-node-modules

## Install

```
npm install @tybys/prune-node-modules
```

## Usage

### JavaScript

``` js
const path = require('path')
const { pnm } = require('@tybys/prune-node-modules')

const input = path.join(__dirname)

pnm(input)
```

### TypeScript

``` ts
import * as path from 'path'
import { pnm } from '@tybys/prune-node-modules'

const input = path.join(__dirname)

pnm(input)
```

## API

``` ts
export declare interface PruneOptions {
  /** Glob patterns */
  whitelist?: string[]
  /** File names */
  removeFiles?: string[]
  /** Directory names */
  removeDirs?: string[]
  /** For application production */
  production?: boolean
}

export declare class Pruner {
  static prune (dir: string, options?: PruneOptions): void
  constructor (options?: PruneOptions)
  prune (dir: string): void
}

export declare function pnm (dir: string, options?: PruneOptions): void
```

## License

MIT.
