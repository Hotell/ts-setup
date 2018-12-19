const { resolve } = require('path')
const sh = require('shelljs')

const { log } = console
const args = process.argv.slice(2)

main()

function main() {
  const { umd, fesm } = processArgs(args)

  const paths = {
    umd: resolve(umd),
    fesm: resolve(fesm),
  }

  const sizes = {
    umd: getBundleSize(paths.umd),
    fesm: getBundleSize(paths.fesm),
  }

  printSize(sizes)
}

//=============================================================================
// Helpers
//=============================================================================

/**
 *
 * @param {string} bundlePath
 * @returns {string}
 */
function getBundleSize(bundlePath) {
  return sh
    .exec(`gzip-size ${bundlePath}`, { silent: true })
    .stdout.toString()
    .replace(/\n/, '')
}

/**
 *
 * @param {{umd:string, fesm: string}} sizes
 */
function printSize(sizes) {
  const sizeBundleTypes = Object.keys(sizes)
  const output = sizeBundleTypes
    .map((type) => `📦   ${type.toUpperCase()}:\t${sizes[type]}`)
    .join('\n')

  log('===============================')
  log('Gzipped + minified bundle size:')
  log(output)
  log('===============================')
}

/**
 *
 * @param {string[]} args
 */
function processArgs(args) {
  if (args.length === 0 || args.length > 2) {
    throw new Error('Only 2 file paths are allowed as arguments. UMD and FESM')
  }

  const [umd, fesm] = args

  return {
    umd,
    fesm,
  }
}
