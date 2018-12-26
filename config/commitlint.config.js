/**
 * @type {import('@commitlint/core').Config}
 */
const config = {
  extends: [
    '@commitlint/config-conventional',
    '@commitlint/config-lerna-scopes',
  ],
}

module.exports = config
