// @ts-check
const { copyFileSync } = require('fs')
const { resolve } = require('path')

const args = process.argv.slice(2)

const ROOT = resolve(__dirname, '..')
const dist = resolve(ROOT, 'dist')

main()

function main() {
  const { template } = parseArgs(args)
  createTSconfig({ templateName: template })
}

// =============================================================================
// helpers
// =============================================================================

/**
 *
 * @param {string[]} args
 */
function parseArgs(args) {
  if (args.length === 0 || args.length > 1) {
    throw new Error('only valid argument is path to template')
  }

  return {
    template: args[0],
  }
}

/**
 *
 * @param {{templateName:string,configFileName?:string}} args
 */
function createTSconfig({ templateName, configFileName = 'tsconfig.json' }) {
  const tsconfigTemplate = resolve(ROOT, templateName)
  const finalTsconfig = resolve(dist, configFileName)

  copyFileSync(tsconfigTemplate, finalTsconfig)
}
