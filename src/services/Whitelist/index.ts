import { Service } from 'typedi'
import {
  GithubRepository,
  MongoRepository,
  SnapshotRepository,
} from 'repositories'
import { OrgData, Space } from 'types'
import { filterSpaces, split } from 'utils'
import WhitelistServiceInterface from './interface'

@Service()
export class WhitelistService implements WhitelistServiceInterface {
  constructor(
    readonly db: MongoRepository,
    readonly gh: GithubRepository,
    readonly snapshot: SnapshotRepository,
  ) {}

  async getSpaces(
    {
      maxOrgs = 100,
      minFollowers = 10_000,
    }: {
      maxOrgs?: number
      minFollowers?: number
    } = { maxOrgs: 100, minFollowers: 10_000 },
  ) {
    const spaces = await this.snapshot.getSpaces()
    return Object.values(spaces)
      .reduce<Space[]>((spaces, space) => {
        if (filterSpaces(minFollowers)(space)) {
          spaces.push(space)
        }
        return spaces
      }, [])
      .sort((a, b) => b.followers - a.followers)
      .slice(0, maxOrgs)
      .reduce<Record<string, Space>>((spaces, space) => {
        spaces[space.snapshotId] = space
        return spaces
      }, {})
  }

  async getOrgsWithRepos(
    {
      maxOrgs,
      minFollowers,
    }: {
      maxOrgs?: number
      minFollowers?: number
    } = { maxOrgs: 100, minFollowers: 10_000 },
  ) {
    const spaces = await this.getSpaces({ maxOrgs, minFollowers })
    const ghNames = await this.snapshot.getGhNamesBySpaceIds(
      Object.keys(spaces),
    )
    const orgs = Object.entries(spaces).reduce<Record<string, OrgData>>(
      (orgs, [snapshotId, space]) => {
        orgs[snapshotId] = {
          ...space,
          ghName: ghNames[snapshotId]?.ghName ?? null,
        }
        return orgs
      },
      {},
    )

    await Promise.all(
      split<{ ghName: string; snapshotId: string }>(
        Object.values(orgs).reduce<
          Array<{ ghName: string; snapshotId: string }>
        >((ghNames, { ghName, snapshotId }) => {
          if (ghName !== null) ghNames.push({ ghName, snapshotId })
          return ghNames
        }, []),
      ).map(async (ghNames) => {
        await Promise.all(
          ghNames.map(async ({ ghName, snapshotId }) => {
            const repos = await this.gh.getReposByOrg(ghName)
            if (repos.length > 0) orgs[snapshotId].repos = repos
          }),
        )
      }),
    )

    return orgs
  }

  async getWhitelistShort() {
    const orgs = await this.db.findAllWhitelistedOrgs()
    return (
      orgs
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        .map(({ ghName, repos }) => repos.map((repo) => `${ghName}/${repo}`))
        .flat()
    )
  }

  async getWhitelist(format: 'short' | 'long' = 'short') {
    if (format === 'long') return this.db.findAllWhitelistedOrgs()
    return this.getWhitelistShort()
  }

  async refresh() {
    const orgs = await this.getOrgsWithRepos()
    return this.db.upsertOrgs(Object.values(orgs))
  }

  async unWhitelist(ghNameOrSnapshotId: string): Promise<any> {
    return Promise.resolve('unimplemented')
  }
}
