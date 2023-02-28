import { TestBed } from '@automock/jest'
import {
  GithubRepository,
  MongoRepository,
  SnapshotRepository,
} from 'repositories'
import { WhitelistService } from 'services/Whitelist'

const ORGS = [
  {
    followers: 10,
    ghName: 'a',
    repos: ['aa', 'ab'],
    snapshotId: 'a.eth',
    snapshotName: 'A',
  },
  {
    followers: 100,
    ghName: 'b',
    repos: ['ba', 'bb'],
    snapshotId: 'b.eth',
    snapshotName: 'B',
  },
]

describe('WhitelistService', () => {
  let whitelistService: WhitelistService
  let gh: jest.Mocked<GithubRepository>
  let snapshot: jest.Mocked<SnapshotRepository>
  let db: jest.Mocked<MongoRepository>

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(WhitelistService).compile()
    whitelistService = unit
    gh = unitRef.get(GithubRepository)
    snapshot = unitRef.get(SnapshotRepository)
    db = unitRef.get(MongoRepository)
  })

  const SPACES = {
    'a.eth': { followers: 10_000, snapshotId: 'a.eth', snapshotName: 'a' },
    'b.eth': { followers: 100_000, snapshotId: 'b.eth', snapshotName: 'b' },
    'c.eth': { followers: 100_000, snapshotId: 'c.eth', snapshotName: 'c' },
  }

  describe('get spaces', () => {
    it('should return spaces', async () => {
      snapshot.getSpaces.mockResolvedValue(SPACES)

      const result = await whitelistService.getSpaces()

      expect(result).toMatchInlineSnapshot(`
        {
          "a.eth": {
            "followers": 10000,
            "snapshotId": "a.eth",
            "snapshotName": "a",
          },
          "b.eth": {
            "followers": 100000,
            "snapshotId": "b.eth",
            "snapshotName": "b",
          },
          "c.eth": {
            "followers": 100000,
            "snapshotId": "c.eth",
            "snapshotName": "c",
          },
        }
      `)
    })

    it('getSpaces: returns max maxOrgs spaces with at least minFollowers', async () => {
      snapshot.getSpaces.mockResolvedValueOnce({
        d: { followers: 1000, snapshotId: 'd.eth', snapshotName: 'd' },
        ...SPACES,
      })

      await expect(whitelistService.getSpaces({ maxOrgs: 2 })).resolves
        .toMatchInlineSnapshot(`
        {
          "b.eth": {
            "followers": 100000,
            "snapshotId": "b.eth",
            "snapshotName": "b",
          },
          "c.eth": {
            "followers": 100000,
            "snapshotId": "c.eth",
            "snapshotName": "c",
          },
        }
      `)
    })
  })

  it('getOrgsWithRepos: return list of orgs that includes repos', async () => {
    snapshot.getSpaces.mockResolvedValue(SPACES)
    snapshot.getGhNamesBySpaceIds.mockResolvedValueOnce({
      'a.eth': { ghName: 'a', snapshotId: 'a.eth' },
      'b.eth': {
        ghName: 'b',
        snapshotId: 'b.eth',
      },
      'c.eth': { ghName: 'c', snapshotId: 'c.eth' },
    })

    gh.getReposByOrg.mockImplementation(async (org) => {
      if (org === 'a') return Promise.resolve(['repo-aa', 'repo-ab'])
      if (org === 'b') return Promise.resolve(['repo-ba', 'repo-bb'])
      if (org === 'c') return Promise.resolve(['repo-ca'])
      return Promise.resolve([])
    })

    await expect(whitelistService.getOrgsWithRepos()).resolves
      .toMatchInlineSnapshot(`
      {
        "a.eth": {
          "followers": 10000,
          "ghName": "a",
          "repos": [
            "repo-aa",
            "repo-ab",
          ],
          "snapshotId": "a.eth",
          "snapshotName": "a",
        },
        "b.eth": {
          "followers": 100000,
          "ghName": "b",
          "repos": [
            "repo-ba",
            "repo-bb",
          ],
          "snapshotId": "b.eth",
          "snapshotName": "b",
        },
        "c.eth": {
          "followers": 100000,
          "ghName": "c",
          "repos": [
            "repo-ca",
          ],
          "snapshotId": "c.eth",
          "snapshotName": "c",
        },
      }
    `)
  })

  describe('whitelist', () => {
    it('getWhitelist: should return orgs in long format', async () => {
      db.findAllWhitelistedOrgs.mockResolvedValueOnce(ORGS)
      await expect(whitelistService.getWhitelist('long')).resolves.toEqual(ORGS)
    })

    it('getWhitelist: should return orgs in short format', async () => {
      db.findAllWhitelistedOrgs.mockResolvedValueOnce(ORGS)
      await expect(whitelistService.getWhitelist('short')).resolves.toEqual({
        daos: ['a.eth', 'b.eth'],
        repos: ['a/aa', 'a/ab', 'b/ba', 'b/bb'],
      })
    })
  })

  it('getWhitelistedDaos: should return list of snapshot ids of the whitelisted orgs', async () => {
    db.findAllWhitelistedOrgs.mockResolvedValueOnce(ORGS)
    await expect(whitelistService.getWhitelistedDaos()).resolves.toEqual([
      'a.eth',
      'b.eth',
    ])
  })

  it('getWhitelistedRepos: should return list of whitelisted repos', async () => {
    db.findAllWhitelistedOrgs.mockResolvedValueOnce(ORGS)
    await expect(whitelistService.getWhitelistedRepos()).resolves.toEqual([
      'a/aa',
      'a/ab',
      'b/ba',
      'b/bb',
    ])
  })

  it.todo('unWhitelist')
})
