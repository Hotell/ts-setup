/**
 * This file only purpose is to copy files before npm publish and strip churn/security sensitive metadata from package.json
 *
 * **NOTE:**
 * 👉 This file should not use any 3rd party dependency
 */
const { writeFileSync, copyFileSync, readdirSync } = require('fs')
const { resolve } = require('path')

const { log } = console

const { packages } = require('../lerna.json')

/**
 * @typedef {typeof import('../package.json')} PkgJson
 */

const MONOREPO_ROOT = resolve(__dirname, '..')
const PACKAGES_ROOT = resolve(MONOREPO_ROOT, 'packages')

main()

function main() {
  const pkgNames = getPackages(packages)

  pkgNames.forEach((pkgName) => {
    processPackage(pkgName)
  })
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 *
 * @param {string[]} packages
 */
function getPackages(packages) {
  return packages.reduce(
    (acc, pkgName) => {
      const isGlob = pkgName.endsWith('*')
      const pkgNames = isGlob
        ? readdirSync(normalizeLernaGlob(pkgName))
        : [pkgName]

      return [...acc, ...pkgNames]
    },
    /** @type {string[]} */ ([])
  )
}

/**
 *
 * @param {string} pkgName
 */
function processPackage(pkgName) {
  const PACKAGE_ROOT = resolve(PACKAGES_ROOT, pkgName)
  const distPath = resolve(PACKAGE_ROOT, 'dist')
  /** @type {PkgJson} */
  const packageJson = require(resolve(PACKAGE_ROOT, 'package.json'))
  const distPackageJson = createDistPackageJson(packageJson)

  log('====================================')
  log(`Preparing 📦  "${pkgName}" for publish:`)

  try {
    copy('README.md', { from: PACKAGE_ROOT, to: distPath })
  } catch (err) {
    console.error('🚨 \tno README.md present...')
  }

  try {
    copy('CHANGELOG.md', { from: PACKAGE_ROOT, to: distPath })
  } catch (err) {
    console.error('🚨 \tno CHANGELOG.md present...')
  }

  try {
    copy('LICENSE.md', { from: PACKAGE_ROOT, to: distPath })
  } catch (err) {
    console.error('🚨 \tno LICENSE.md present... using root license')
    copy('LICENSE.md', { from: MONOREPO_ROOT, to: distPath })
  }

  try {
    copy('.npmignore', { from: PACKAGE_ROOT, to: distPath })
  } catch (err) {
    console.error('🚨 \tno .npmignore present... using root .npmignore')
    copy('.npmignore', { from: MONOREPO_ROOT, to: distPath })
  }

  writeFileSync(resolve(distPath, 'package.json'), distPackageJson)

  log('✅ \tFinished')
  log('====================================')
}

/**
 *
 * @param {string} filename
 * @param {{from:string,to:string}} pathConfig
 */
function copy(filename, { from, to }) {
  copyFileSync(resolve(from, filename), resolve(to, filename))
}

/**
 *
 * @param {string} glob
 */
function normalizeLernaGlob(glob) {
  return `./${glob.replace(/[*/]/g, '')}`
}

/**
 * @param {PkgJson} packageConfig
 * @return {string}
 */
function createDistPackageJson(packageConfig) {
  const {
    devDependencies,
    scripts,
    engines,
    config,
    husky,
    'lint-staged': lintStaged,
    ...distPackageJson
  } = packageConfig

  return JSON.stringify(distPackageJson, null, 2)
}
