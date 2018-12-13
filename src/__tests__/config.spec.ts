import { config } from '../config'

describe(`tslint config`, () => {
  it(`should should export tsconfig`, () => {
    expect(config.extends).toEqual([
      'tslint:recommended',
      'tslint-config-standard',
      'tslint-etc',
      'tslint-react',
      'tslint-config-prettier',
    ])
    expect(config.jsRules).toBe(true)
  })
})
