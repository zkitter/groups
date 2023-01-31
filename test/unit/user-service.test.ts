import { TestBed } from '@automock/jest'
import { GithubRepository, MongoRepository } from 'repositories'
import { UserService, WhitelistService } from 'services'

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
  let whitelist: jest.Mocked<WhitelistService>

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(UserService).compile()
    userService = unit
    gh = unitRef.get(GithubRepository)
    db = unitRef.get(MongoRepository)
    whitelist = unitRef.get(WhitelistService)
  })

  it('getContributedRepositories: fetches from GH and returns contributed repos', async () => {
    gh.getContributedRepos.mockResolvedValueOnce(REPOS)

    await expect(userService.getContributedRepos('foo')).resolves.toEqual([
      'A/a',
      'B/b',
    ])
    expect(gh.getContributedRepos).toHaveBeenCalledOnceWith('foo')
  })

  describe('belongsToContributorsGroup', () => {
    it('returns true if user has contributed to a whitelisted repo', async () => {
      whitelist.getWhitelistShort.mockResolvedValueOnce(['A/a'])

      await expect(
        userService.belongsToGhContributorsGroup({
          ghName: 'foo',
          repos: ['A/a', 'B/b'],
        }),
      ).resolves.toBe(true)

      expect(whitelist.getWhitelistShort).toHaveBeenCalledOnce()
    })

    it('returns false if user has not contributed to a whitelisted repo', async () => {
      whitelist.getWhitelistShort.mockResolvedValueOnce(['C/a'])

      await expect(
        userService.belongsToGhContributorsGroup({
          ghName: 'foo',
          repos: ['A/a', 'B/b'],
        }),
      ).resolves.toBe(false)

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

  describe('getGroups', () => {
    it('returns data about the groups the user is part of', async () => {
      whitelist.getWhitelistShort.mockResolvedValueOnce(['A/a'])

      await expect(
        userService.getGroups({
          ghName: 'foo',
          repos: ['A/a', 'B/b'],
        }),
      ).resolves.toEqual({
        belongsToGhContributorsGroup: true,
      })

      expect(whitelist.getWhitelistShort).toHaveBeenCalledOnce()
    })
  })

  describe('getUser', () => {
    it('can return user data in longer format', async () => {
      db.findUser.mockResolvedValueOnce(USER_DATA)
      whitelist.getWhitelistShort.mockResolvedValueOnce(['A/a'])

      await expect(userService.getUser('foo', 'long')).resolves.toEqual({
        belongsToGhContributorsGroup: true,
        ...USER_DATA,
      })

      expect(db.findUser).toHaveBeenCalledOnceWith('foo')
      expect(whitelist.getWhitelistShort).toHaveBeenCalledOnce()
    })
  })
})
