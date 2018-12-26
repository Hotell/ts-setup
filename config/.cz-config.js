const conventionalCommitTypes = require('conventional-commit-types')

/** @typedef {import('cz-customizable').Option} CzOption */
/** @typedef {import('cz-customizable').Options} CzOptions */

const otherTypes = [
  {
    value: 'WIP',
    name: 'WIP:Work in progress',
  },
]

// @TODO get packages scope automatically by leveraging lerna API's
const packageScopes = ['ts-config', 'ts-lint-config']

const otherScopes = ['examples']

/** @type {CzOption} */
const emptyScope = /** @type {any} */ ({
  name: 'empty',
  value: false,
})

/**
 * @type {Partial<CzOptions>}
 */
const config = {
  types: [...normalizeCommitTypes(conventionalCommitTypes.types, otherTypes)],
  scopes: packageScopes
    .sort()
    .concat(otherScopes)
    .map((name) => ({ name }))
    .concat([emptyScope]),
  allowBreakingChanges: ['feat', 'fix'],
}

module.exports = config

// =============================================================================
// Helpers
// =============================================================================

/**
 *
 * @param {typeof conventionalCommitTypes['types']} types
 * @param {CzOption[]} extraNormalizedTypes
 * @returns {CzOption[]}
 */
function normalizeCommitTypes(types, extraNormalizedTypes) {
  const keys = Object.keys(types)
  const normalizedTypes = keys.map((key) => ({
    value: key,
    name: `${key}:${types[key].description}`,
  }))

  const mergeTypes = [...normalizedTypes, ...extraNormalizedTypes]
  const longestTypeString = getLongestType(mergeTypes)

  const finalTypes = [...normalizedTypes, ...extraNormalizedTypes].map(
    (type) => ({
      ...type,
      name: formatTypeDescription(longestTypeString, type.name),
    })
  )

  return finalTypes
}

/**
 *
 * @param {number} maxLength
 * @param {string} description
 * @returns {string}
 */
function formatTypeDescription(maxLength, description) {
  const [type, desc] = description.split(':')

  const paddedType = `${type}:`.padEnd(maxLength + 2)

  return `${paddedType}${desc}`
}

/**
 *
 * @param {CzOption[]} types
 * @returns {number}
 */
function getLongestType(types) {
  return Math.max.apply(
    null,
    // prettier-ignore
    /** @type {Required<CzOption>[]} */ (types).map(
      (type) => type.value.trim().length
    )
  )
}
