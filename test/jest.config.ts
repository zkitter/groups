import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/service',
    '!<rootDir>/src/snapshot',
    '!<rootDir>/src/gh',
    '!<rootDir>/src/daos',
    '!<rootDir>/src/services/GroupService',
  ],
  coverageDirectory: 'coverage',
  projects: [
    './test/jest.e2e.ts',
    './test/jest.integration.ts',
    './test/jest.lint.ts',
    './test/jest.prettier.ts',
    './test/jest.unit.ts',
  ],
  testTimeout: 60_000,
  watchPlugins: [
    'jest-watch-select-projects',
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
}

export default jestConfig
