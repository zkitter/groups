import type { JestConfigWithTsJest } from 'ts-jest'

import jestUnitConfig from './jest.unit'

const jestIntegrationConfig: JestConfigWithTsJest = {
  ...jestUnitConfig,
  displayName: 'e2e',
  testRegex: 'test/e2e/.*\\.test\\.ts$',
}

export default jestIntegrationConfig
