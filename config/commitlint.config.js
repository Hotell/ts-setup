const configLernaScopes = require('@commitlint/config-lerna-scopes')

/**
 *
 * @param {any?} ctx
 * @returns {Promise<import('@commitlint/core').Rule>}
 */
const scopeEnum = (ctx) =>
  configLernaScopes.utils
    .getPackages(ctx)
    .then((/** @type {string[]} */ packages) => [
      2,
      'always',
      [...packages, 'release'],
    ])

/**
 * @type {import('@commitlint/core').Config}
 */
const config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': scopeEnum,
  },
}

module.exports = config
