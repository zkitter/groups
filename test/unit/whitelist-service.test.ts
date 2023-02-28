import { TestBed } from '@automock/jest'
import { GithubRepository, SnapshotRepository } from 'repositories'
import { WhitelistService } from 'services/Whitelist'

describe('WhitelistService', () => {
  let whitelistService: WhitelistService
  let gh: jest.Mocked<GithubRepository>
  let snapshot: jest.Mocked<SnapshotRepository>

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(WhitelistService).compile()
    whitelistService = unit
    gh = unitRef.get(GithubRepository)
    snapshot = unitRef.get(SnapshotRepository)
  })

  const SPACES = {
    'a.eth': { followers: 10_000, name: 'a' },
    'b.eth': { followers: 100_000, name: 'b' },
    'c.eth': { followers: 100_000, name: 'c' },
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
        d: { followers: 1000, name: 'd' },
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
    snapshot.getGhNamesBySpaceIds.mockResolvedValueOnce([
      { ghName: 'a', snapshotId: 'a.eth' },
      {
        ghName: 'b',
        snapshotId: 'b.eth',
      },
      { ghName: 'c', snapshotId: 'c.eth' },
    ])
    snapshot.getVotedSpacesByAddress.mockResolvedValueOnce({
      'a.eth': ['0xfoo1', '0xfoo2'],
      'b.eth': ['0xbar'],
    })
    gh.getReposByOrg
      .mockResolvedValueOnce(['repo-aa', 'repo-ab'])
      .mockResolvedValueOnce(['repo-ba', 'repo-bb'])
      .mockResolvedValueOnce(['repo-ca'])

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

  it.todo('unWhitelist')
})
