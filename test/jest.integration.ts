import type { JestConfigWithTsJest } from 'ts-jest'

import jestUnitConfig from './jest.unit'

const jestIntegrationConfig: JestConfigWithTsJest = {
  ...jestUnitConfig,
  displayName: 'integration',
}

export default jestIntegrationConfig
