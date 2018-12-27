// ============================
// Extend existing types
// ============================

// ============================∫
// Rollup plugins without types
// ============================
type RollupPluginImpl<O extends object = object> = import('rollup').PluginImpl<
  O
>

declare module 'rollup-plugin-json' {
  export interface Options {
    /**
     *  All JSON files will be parsed by default, but you can also specifically include/exclude files
     */
    include?: string | string[]
    exclude?: string | string[]
    /**
     *  for tree-shaking, properties will be declared as variables, using either `var` or `const`
     *  @default false
     */
    preferConst?: boolean
    /**
     * specify indentation for the generated default export — defaults to '\t'
     * @default '\t'
     */
    indent?: string
  }
  const plugin: RollupPluginImpl<Options>
  export default plugin
}
declare module 'rollup-plugin-sourcemaps' {
  const plugin: RollupPluginImpl
  export default plugin
}
declare module 'rollup-plugin-node-resolve' {
  const plugin: RollupPluginImpl
  export default plugin
}
declare module 'rollup-plugin-commonjs' {
  const plugin: RollupPluginImpl
  export default plugin
}
declare module 'rollup-plugin-replace' {
  const plugin: RollupPluginImpl
  export default plugin
}
declare module 'rollup-plugin-uglify' {
  const uglify: RollupPluginImpl
  export { uglify }
}
declare module 'rollup-plugin-terser' {
  const terser: RollupPluginImpl
  export { terser }
}

// =====================
// missing library types
// =====================

// WHY?
// > ts-jest types require 'babel__core'
declare module 'babel__core' {
  interface TransformOptions {}
}

declare module '@lerna/project' {
  export async function getPackages(): Array<{ name: string }>
  export = Project
  class Project {
    constructor(cwd: string)
    readonly config: object
    readonly version: string
    readonly manifest: object
    readonly packageConfigs: string[]
    readonly packageParentDirs: string[]
    readonly licensePath: string | undefined
    async getPackageLicensePaths(): string[]
    isIndependent(): boolean
    getPackages: typeof getPackages
  }
}

declare module '@commitlint/config-lerna-scopes'

declare module '@commitlint/core' {
  type Casing =
    | 'lower-case' // default
    | 'upper-case' // UPPERCASE
    | 'camel-case' // camelCase
    | 'kebab-case' // kebab-case
    | 'pascal-case' // PascalCase
    | 'sentence-case' // Sentence case
    | 'snake-case' // snake_case
    | 'start-case' // Start Case

  type Level =
    | 0 // disables the rule
    | 1 // it will be considered a warning
    | 2 // it will be considered an error
  type Applicable = 'always' | 'never'
  type Value = any
  type Rule = [Level, Applicable, Value?]
  type RuleType = Rule | ((ctx?: any) => Rule) | ((ctx?: any) => Promise<Rule>)

  interface Config {
    extends?: string[]
    rules?: { [name: string]: RuleType }
  }
}

declare module 'sort-object-keys' {
  const sortPackageJson: <T extends {}>(
    object: T,
    sortWith?: (...args: any[]) => any
  ) => T
  export = sortPackageJson
}

declare module 'replace-in-file' {
  interface Options {
    files: string | string[]
    from: Array<string | RegExp>
    to: string | string[]
    ignore: string | string[]
    dry: boolean
    encoding: string
    disableGlobs: boolean
    allowEmptyPaths: boolean
  }

  interface API {
    (options: Partial<Options>): string[]
    sync(options: Partial<Options>): string[]
  }

  const api: API
  export = api
}
