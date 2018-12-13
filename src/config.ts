type Config = import('tslint').Configuration.RawConfigFile
type RulesConfig = import('tslint').Configuration.RawRulesConfig
type RuleConfig = import('tslint').Configuration.RawRuleConfig

const xtends = [
  'tslint:recommended',
  'tslint-config-standard',
  'tslint-etc',
  'tslint-react',
  'tslint-config-prettier',
]

const rules: RulesConfig = {
  // types related rules
  'no-inferrable-types': true,
  'no-namespace': {
    options: ['allow-declarations'],
  },
  'interface-name': {
    options: 'never-prefix',
  },
  'no-unsafe-any': true,
  // core lint rules
  ban: {
    options: [
      {
        name: 'parseInt',
        message: 'use #type-coercion -> Number(val)',
      },
      {
        name: 'parseFloat',
        message: 'use #type-coercion -> Number(val)',
      },
      {
        name: 'Array',
        message: 'use #array-constructor',
      },
      {
        name: ['describe', 'only'],
        message: "don't focus spec blocks",
      },
      {
        name: ['it', 'only'],
        message: "don't focus tests",
      },
    ],
  },
  'no-magic-numbers': true,
  'no-require-imports': true,
  'no-boolean-literal-compare': true,
  'no-invalid-this': {
    options: 'check-function-in-method',
  },
  'no-invalid-template-strings': true,
  'ordered-imports': true,
  'prefer-template': true,
  'newline-before-return': true,
  'match-default-export-name': true,
  'no-parameter-reassignment': true,
  'file-name-casing': {
    options: ['kebab-case'],
  },
  'switch-default': true,
  // tslint:recommended overrides
  'no-any': true,
  'member-access': {
    options: ['no-public'],
  },
  'object-literal-sort-keys': false,
  'interface-over-type-literal': false,
  // tslint:tslint-config-standard overrides
  //
  // tslint-etc rules
  'no-unused-declaration': true,
  'no-missing-dollar-expect': true,
  'no-assign-mutated-array': true,
  // tslint-react rules
  'jsx-boolean-value': {
    options: 'never',
  },
}

// Apply the same rules for any JS if allowJS is gonna be used
// @TODO following needs to be released to make this work: https://github.com/palantir/tslint/pull/3641/
// tslint:disable-next-line:no-any
const jsRules: RulesConfig = true as any

export const config: Config = {
  extends: xtends,
  rules,
  jsRules,
}
