import { TestBed } from '@automock/jest'
import { faker } from '@faker-js/faker'
import {
  GithubRepository,
  MongoRepository,
  SnapshotRepository,
} from 'repositories'
import { UserService, WhitelistService } from 'services'
import { getTime } from '../../src/utils'

describe('UserService', () => {
  const REPOS = [
    { name: 'a', org: 'A' },
    { name: 'b', org: 'B' },
  ]
  const USER_DATA = {
    ghName: 'foo',
    repos: ['A/a', 'B/b'],
  }
  let userService: UserService
  let db: jest.Mocked<MongoRepository>
  let gh: jest.Mocked<GithubRepository>
  let snapshot: jest.Mocked<SnapshotRepository>
  let whitelist: jest.Mocked<WhitelistService>

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(UserService).compile()
    userService = unit
    gh = unitRef.get(GithubRepository)
    db = unitRef.get(MongoRepository)
    snapshot = unitRef.get(SnapshotRepository)
    whitelist = unitRef.get(WhitelistService)
  })

  it('getContributedRepos: fetches from GH and returns repos a user has contributed to', async () => {
    gh.getContributedRepos.mockResolvedValueOnce(REPOS)

    await expect(userService.getContributedRepos('foo')).resolves.toEqual([
      'A/a',
      'B/b',
    ])
    expect(gh.getContributedRepos).toHaveBeenCalledOnceWith('foo')
  })

  it('getVotedOrgs: fetches from Snapshot and returns orgs a user has voted to', async () => {
    const SPACE_IDS = ['space1', 'space2']
    const address = faker.finance.ethereumAddress()
    const since = faker.date.past()
    const until = faker.date.future()
    snapshot.getVotedSpacesByAddress.mockResolvedValueOnce(SPACE_IDS)

    await expect(
      userService.getVotedOrgs({ address, since, until }),
    ).resolves.toEqual(SPACE_IDS)

    expect(snapshot.getVotedSpacesByAddress).toHaveBeenCalledOnceWith({
      address,
      since: getTime(since),
      until: getTime(until),
    })
  })

  describe('belongsToContributorsGroup', () => {
    it('returns true if user has contributed to a whitelisted repo', async () => {
      whitelist.getWhitelistShort.mockResolvedValueOnce({
        daos: [],
        repos: ['A/a'],
      })

      await expect(
        userService.belongsToGhContributorsGroup({
          ghName: 'foo',
          repos: ['A/a', 'B/b'],
        }),
      ).resolves.toBe(true)

      expect(whitelist.getWhitelistShort).toHaveBeenCalledOnce()
    })

    it('returns false if user has not contributed to a whitelisted repo', async () => {
      whitelist.getWhitelistShort.mockResolvedValueOnce({
        daos: [],
        repos: ['C/a'],
      })

      await expect(
        userService.belongsToGhContributorsGroup({
          ghName: 'foo',
          repos: ['A/a', 'B/b'],
        }),
      ).resolves.toBe(false)

      expect(whitelist.getWhitelistShort).toHaveBeenCalledOnce()
    })
  })

  describe('belongsToVotersGroup', () => {
    it('returns true if user has voted to a whitelisted org', async () => {
      whitelist.getWhitelistShort.mockResolvedValueOnce({
        daos: ['A'],
        repos: [],
      })
      snapshot.getVotedSpacesByAddress.mockResolvedValueOnce(['A'])

      await expect(userService.belongsToVotersGroup('0x123')).resolves.toBe(
        true,
      )

      expect(whitelist.getWhitelistShort).toHaveBeenCalledOnce()
      expect(snapshot.getVotedSpacesByAddress).toHaveBeenCalledOnceWith({
        address: '0x123',
        since: expect.any(Number),
        until: expect.any(Number),
      })
    })

    it('returns false if user has not voted to a whitelisted org', async () => {
      whitelist.getWhitelistShort.mockResolvedValueOnce({
        daos: ['C'],
        repos: [],
      })

      await expect(userService.belongsToVotersGroup('0x123')).resolves.toBe(
        false,
      )

      expect(whitelist.getWhitelistShort).toHaveBeenCalledOnce()
    })
  })

  describe('refresh', () => {
    it('fetches from GH and stores in DB', async () => {
      gh.getContributedRepos.mockResolvedValueOnce(REPOS)
      db.upsertUser.mockResolvedValueOnce(USER_DATA)

      await expect(userService.refresh('foo')).resolves.toEqual(USER_DATA)

      expect(gh.getContributedRepos).toHaveBeenCalledOnceWith('foo')
      expect(db.upsertUser).toHaveBeenCalledOnceWith(USER_DATA)
    })
  })

  describe('getGhUser', () => {
    it('can return user data in longer format', async () => {
      db.findUser.mockResolvedValueOnce(USER_DATA)
      whitelist.getWhitelistShort.mockResolvedValueOnce({
        daos: [],
        repos: ['A/a'],
      })

      await expect(userService.getGhUser('foo', 'long')).resolves.toEqual({
        belongsToGhContributorsGroup: true,
        ...USER_DATA,
      })

      expect(db.findUser).toHaveBeenCalledOnceWith('foo')
      expect(whitelist.getWhitelistShort).toHaveBeenCalledOnce()
    })
  })
})
