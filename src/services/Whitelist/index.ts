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
  ) {
  }

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
    return this.getWhitelist('short')
  }

  async getWhitelist(format: 'short' | 'long' = 'short') {
    const orgs = await this.db.findAllWhitelistedOrgs()
    if (format === 'long') {
      return orgs
    } else {
      return orgs.reduce<{ daos: string[], repos: string[] }>((orgs, { ghName, repos, snapshotId }) => {
        orgs.daos.push(snapshotId)
        if (ghName !== null) orgs.repos.push(...repos.map((repo) => `${ghName}/${repo}`))
        return orgs
      }, { daos: [], repos: [] })
    }
  }

  async getWhitelistedDaos(): Promise<string[]> {
    const { daos } = (await this.getWhitelist('short') as { daos: string[] })
    return daos
  }

  async getWhitelistedRepos(): Promise<string[]> {
    const { repos } = (await this.getWhitelist('short') as { repos: string[] })
    return repos
  }

  async refresh() {
    const orgs = await this.getOrgsWithRepos()
    return this.db.upsertOrgs(Object.values(orgs))
  }

  async unWhitelist(ghNameOrSnapshotId: string): Promise<any> {
    return Promise.resolve('unimplemented')
  }

}
