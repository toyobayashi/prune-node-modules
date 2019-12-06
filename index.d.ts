declare namespace pnm {
  export interface PruneOptions {
    whitelist?: string[]
    removeFiles?: string[]
    removeDirs?: string[]
    production?: boolean
  }
}

declare function pnm (dir: string, options?: PruneOptions): void

export = pnm
