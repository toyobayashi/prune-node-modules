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
