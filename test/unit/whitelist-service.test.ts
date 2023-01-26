import { mock } from 'jest-mock-extended'
import { Container } from 'typedi'
import { MongoRepository } from 'repositories/Mongo'
import { WhitelistService } from 'services/Whitelist'
import { GithubRepository, SnapshotRepository } from '../../src/repositories'
import { orgsBuilder } from '../lib'

describe('WhitelistService', () => {
  let whitelistService: WhitelistService
  const db = Container.get(MongoRepository)
  const gh = mock<GithubRepository>()
  const snapshot = mock<SnapshotRepository>()

  beforeEach(() => {
    whitelistService = new WhitelistService(db, gh, snapshot)
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

  it('getGhOrgs: return list of github orgs', async () => {
    snapshot.getGhOrgsBySpaceIds.mockResolvedValueOnce([
      { ghName: 'a', snapshotId: 'a.eth' },
      {
        ghName: null,
        snapshotId: 'b.eth',
      },
    ])

    await expect(
      whitelistService.getGhOrgs(['a.eth', 'b.eth']),
    ).resolves.toEqual([
      {
        ghName: 'a',
        snapshotId: 'a.eth',
      },
    ])
  })

  it('getOrgs: return list of orgs', async () => {
    snapshot.getSpaces.mockResolvedValue(SPACES)
    snapshot.getGhOrgsBySpaceIds.mockResolvedValueOnce([
      { ghName: 'a', snapshotId: 'a.eth' },
      {
        ghName: 'b',
        snapshotId: 'b.eth',
      },
      { ghName: 'c', snapshotId: 'c.eth' },
    ])
    gh.getReposByOrg
      .mockResolvedValueOnce(['repo-aa', 'repo-ab'])
      .mockResolvedValueOnce(['repo-ba', 'repo-bb'])
      .mockResolvedValueOnce(['repo-ca'])

    await expect(whitelistService.getOrgs()).resolves.toMatchInlineSnapshot(`
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

  it('refresh: update orgs in db', async () => {
    const orgs = orgsBuilder(3)
    snapshot.getSpaces.mockResolvedValue(
      orgs.reduce((spaces, { followers, snapshotId, snapshotName }) => {
        // @ts-expect-error
        spaces[snapshotId] = { followers, name: snapshotName }
        return spaces
      }, {}),
    )
    snapshot.getGhOrgsBySpaceIds.mockResolvedValueOnce(
      orgs.map(({ ghName, snapshotId }) => ({ ghName, snapshotId })),
    )
    gh.getReposByOrg
      .mockResolvedValueOnce(orgs[0].repos)
      .mockResolvedValueOnce(orgs[1].repos)
    jest
      .spyOn(db, 'upsertOrg')
      .mockResolvedValueOnce(orgs[0])
      .mockResolvedValueOnce(orgs[1])
      .mockResolvedValueOnce(orgs[2])

    await expect(whitelistService.refresh()).resolves.toEqual(orgs)
  })

  it.todo('unWhitelist')
})
