import { faker } from '@faker-js/faker'
import { build, perBuild } from '@jackfranklin/test-data-bot'
import { Org, PrismaClient } from '@prisma/client'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'

export const orgBuilder = build<Org>({
  fields: {
    followers: perBuild(() => faker.datatype.number({ min: 10_000 })),
    followers7d: null,
    ghName: perBuild(() => faker.internet.userName()),
    id: perBuild(() => faker.database.mongodbObjectId()),
    repos: perBuild(() =>
      [...Array(faker.datatype.number({ max: 5, min: 1 }))].map(() =>
        faker.internet.userName(),
      ),
    ),
    snapshotId: perBuild(() => `${faker.lorem.word()}.eth`),
    snapshotName: perBuild(() =>
      faker.lorem.word({ length: { max: 3, min: 1 } }),
    ),
    updatedAt: perBuild(() => faker.date.past()),
  },
})

export type MockContext = DeepMockProxy<PrismaClient>
export const createMockContext = (): MockContext => mockDeep<PrismaClient>()
