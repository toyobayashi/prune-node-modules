declare namespace pnm {
  export interface PruneOptions {
    whitelist?: string[]
    removeFiles?: string[]
  }
}

declare function pnm (dir: string, options?: PruneOptions): void

export = pnm
