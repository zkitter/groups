import { TestBed } from '@automock/jest'
import { GithubRepository, MongoRepository } from 'repositories'
import { UserService, WhitelistService } from 'services'

describe('UserService', () => {
  const REPOS = [
    { name: 'a', org: 'A' },
    { name: 'b', org: 'B' },
  ]
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
      db.findUser.mockResolvedValueOnce({
        ghName: 'foo',
        repos: ['A/a', 'B/b'],
      })
      whitelist.getWhitelistShort.mockResolvedValueOnce(['A/a'])

      await expect(userService.belongsToContributorsGroup('foo')).resolves.toBe(
        true,
      )

      expect(db.findUser).toHaveBeenCalledOnceWith('foo')
      expect(whitelist.getWhitelistShort).toHaveBeenCalledOnce()
    })

    it('returns false if user has not contributed to a whitelisted repo', async () => {
      db.findUser.mockResolvedValueOnce({
        ghName: 'foo',
        repos: ['A/a', 'B/b'],
      })
      whitelist.getWhitelistShort.mockResolvedValueOnce(['C/a'])

      await expect(userService.belongsToContributorsGroup('foo')).resolves.toBe(
        false,
      )

      expect(db.findUser).toHaveBeenCalledOnceWith('foo')
      expect(whitelist.getWhitelistShort).toHaveBeenCalledOnce()
    })
  })

  describe('refresh', () => {
    it('fetches from GH and stores in DB', async () => {
      gh.getContributedRepos.mockResolvedValueOnce(REPOS)
      db.upsertUser.mockResolvedValueOnce({
        ghName: 'foo',
        repos: ['A/a', 'B/b'],
      })

      await expect(userService.refresh('foo')).resolves.toEqual({
        ghName: 'foo',
        repos: ['A/a', 'B/b'],
      })

      expect(gh.getContributedRepos).toHaveBeenCalledOnceWith('foo')
      expect(db.upsertUser).toHaveBeenCalledOnceWith({
        ghName: 'foo',
        repos: ['A/a', 'B/b'],
      })
    })
  })
})
