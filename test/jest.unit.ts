import type { JestConfigWithTsJest } from 'ts-jest'
import { pathsToModuleNameMapper } from 'ts-jest'
import { compilerOptions } from '../tsconfig.json'

import common from './jest.common'

const jestUnitConfig: JestConfigWithTsJest = {
  ...common,
  clearMocks: true,
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  displayName: 'unit',
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  moduleFileExtensions: ['js', 'ts'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/src',
  }),
  preset: 'ts-jest',
  setupFilesAfterEnv: ['jest-extended/all', 'jest-chain', './test/setup.ts'],
  testRegex: 'test/unit/.*\\.test\\.ts$',
}

export default jestUnitConfig
