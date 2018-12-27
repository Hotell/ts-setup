/**
 * This file only purpose is to copy files before npm publish and strip churn/security sensitive metadata from package.json
 *
 * **NOTE:**
 * 👉 This file should not use any 3rd party dependency
 */
const { writeFileSync, copyFileSync } = require('fs')
const { resolve } = require('path')
const { getPackages } = require('@lerna/project')

const { log } = console

// TYPES
/** @typedef {typeof import('../package.json')} PkgJson */

const MONOREPO_ROOT = resolve(__dirname, '..')
const PACKAGES_ROOT = resolve(MONOREPO_ROOT, 'packages')

main()

async function main() {
  const pkgNames = await getMonorepoPackageNames()

  pkgNames.forEach((pkgName) => {
    processPackage(pkgName)
  })
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * @returns {Promise<string[]>}
 */
async function getMonorepoPackageNames() {
  const repoPackages = await getPackages()

  const normalizedNamesArr = repoPackages
    .map((pkg) => pkg.name)
    .map((name) => (name.charAt(0) === '@' ? name.split('/')[1] : name))

  return normalizedNamesArr
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
