// @ts-check
const { copyFileSync } = require('fs')
const { resolve } = require('path')
// const template = require('../src/tsconfig.lib.json')

const tsconfigTemplate = resolve(__dirname, '..', 'src', 'tsconfig.lib.json')
const dist = resolve(__dirname, '..', 'dist')
const finalTsconfig = resolve(dist, 'tsconfig.json')

copyFileSync(tsconfigTemplate, finalTsconfig)
