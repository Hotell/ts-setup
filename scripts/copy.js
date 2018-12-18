/**
 * This file only purpose is to copy files before npm publish and strip churn/security sensitive metadata from package.json
 *
 * **NOTE:**
 * 👉 This file should not use any 3rd party dependency
 */
const { writeFileSync, copyFileSync, readdirSync } = require('fs')
const { resolve } = require('path')

const { packages } = require('../lerna.json')

/**
 * @typedef {typeof import('../package.json')} PkgJson
 */

const MONOREPO_ROOT = resolve(__dirname, '..')
const PACKAGES_ROOT = resolve(MONOREPO_ROOT, 'packages')

main()

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

  copyFileSync(
    resolve(PACKAGE_ROOT, 'README.md'),
    resolve(distPath, 'README.md')
  )

  try {
    copyFileSync(
      resolve(PACKAGE_ROOT, 'CHANGELOG.md'),
      resolve(distPath, 'CHANGELOG.md')
    )
  } catch (err) {
    console.error('🚨 no CHANGELOG.md present... \n')
  }

  try {
    copyFileSync(
      resolve(PACKAGE_ROOT, 'LICENSE.md'),
      resolve(distPath, 'LICENSE.md')
    )
  } catch (err) {
    console.error('🚨 no LICENSE.md present... using root license \n')
    copyFileSync(
      resolve(MONOREPO_ROOT, 'LICENSE.md'),
      resolve(distPath, 'LICENSE.md')
    )
  }

  try {
    copyFileSync(
      resolve(PACKAGE_ROOT, '.npmignore'),
      resolve(distPath, '.npmignore')
    )
  } catch (err) {
    console.error('🚨 no .npmignore present... using root .npmignore \n')
    copyFileSync(
      resolve(MONOREPO_ROOT, '.npmignore'),
      resolve(distPath, '.npmignore')
    )
  }

  writeFileSync(resolve(distPath, 'package.json'), distPackageJson)
}

function main() {
  packages.forEach((pkgName) => {
    const isGlob = pkgName.endsWith('*')
    if (isGlob) {
      const pkgNames = readdirSync(normalizeLernaGlob(pkgName)).map((file) => {
        return file
      })

      console.log(
        '\n preparing following packages for publish: \n',
        pkgNames.map((pkgName) => `📦  ${pkgName}`).join('\n'),
        '\n',
        '====================================================',
        '\n'
      )

      pkgNames.forEach((pkgName) => {
        processPackage(pkgName)
      })
    }
  })
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
