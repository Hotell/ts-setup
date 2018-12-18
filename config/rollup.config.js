import { resolve } from 'path'
import sourceMaps from 'rollup-plugin-sourcemaps'
import nodeResolve from 'rollup-plugin-node-resolve'
import json from 'rollup-plugin-json'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import { uglify } from 'rollup-plugin-uglify'
import { terser } from 'rollup-plugin-terser'
import { getIfUtils, removeEmpty } from 'webpack-config-utils'

const {
  pascalCase,
  normalizePackageName,
  getOutputFileName,
} = require('./helpers')

/**
 * @typedef {import('./types').RollupConfig} Config
 */
/**
 * @typedef {import('./types').RollupPlugin} Plugin
 */

const env = process.env.NODE_ENV || 'development'
const pkgName = process.env.PKG_NAME
const { ifProduction } = getIfUtils(env)

if (!pkgName) {
  throw new Error('PKG_NAME is required!')
}

const MONOREPO_ROOT = resolve(__dirname, '..')
const PACKAGES_ROOT = resolve(MONOREPO_ROOT, 'packages')
const PACKAGE_ROOT = resolve(PACKAGES_ROOT, pkgName)
/** @type {typeof import('../package.json') & {peerDependencies?: object}} */
const pkg = require(resolve(PACKAGE_ROOT, 'package.json'))

const LIB_NAME = pascalCase(normalizePackageName(pkg.name))

const DIST = resolve(PACKAGE_ROOT, 'dist')

/**
 * Object literals are open-ended for js checking, so we need to be explicit
 *
 * @type {{entry:{esm5: string, esm2015: string},bundles:string}}
 */
const PATHS = {
  entry: {
    esm5: resolve(DIST, 'esm5'),
    esm2015: resolve(DIST, 'esm2015'),
  },
  bundles: resolve(DIST, 'bundles'),
}

/**
 * Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
 *
 * @type {string[]}
 */
const external = Object.keys(pkg.peerDependencies) || []

/**
 *  @type {Plugin[]}
 */
const plugins = /** @type {Plugin[]} */ ([
  // Allow json resolution
  json(),

  // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
  commonjs(),

  // Allow node_modules resolution, so you can use 'external' to control
  // which external modules to include in the bundle
  // https://github.com/rollup/rollup-plugin-node-resolve#usage
  nodeResolve(),

  // Resolve source maps to the original source
  sourceMaps(),

  // properly set process.env.NODE_ENV within `./environment.ts`
  replace({
    exclude: 'node_modules/**',
    'process.env.NODE_ENV': JSON.stringify(env),
  }),
])

const commonConfig = /** @type {Required<Config>} */ ({
  inlineDynamicImports: true,
  external,
  plugins,
})

const UMDconfig = createConfig('umd', commonConfig)
const FESMconfig = createConfig('esm', commonConfig)

export default [UMDconfig, FESMconfig]

// ============================================================================
// helpers
// ============================================================================

/**
 * @param {'umd'|'esm'} format
 * @param {Required<Config>} common
 * @returns {Config}
 */
function createConfig(format, { plugins, ...common }) {
  if (!['umd', 'esm'].includes(format)) {
    throw new Error(`Invalid format ${format}. Please use one of 'umd' | 'esm'`)
  }

  const inputFilePath =
    format === 'esm' ? PATHS.entry.esm2015 : PATHS.entry.esm5
  const name = format === 'umd' ? LIB_NAME : null
  const outputFileName = getOutputFileName(
    resolve(PATHS.bundles, `index.${format}.js`),
    ifProduction()
  )
  const minifier = format === 'esm' ? terser : uglify

  const config = /** @type {Config} */ ({
    ...common,
    input: resolve(inputFilePath, 'index.js'),
    output: {
      file: outputFileName,
      format,
      name,
      sourcemap: true,
    },
    plugins: /** @type {Plugin[]} */ (removeEmpty([
      ...plugins,
      ifProduction(minifier()),
    ])),
  })

  return config
}
