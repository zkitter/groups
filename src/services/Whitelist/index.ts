import { Org } from '@prisma/client'
import {
  GithubRepository,
  MongoRepository,
  SnapshotRepository,
} from 'repositories'
import { filterSpaces } from '../../snapshot/get-spaces'
import { OrgData, Space } from '../../types'
import { split } from '../../utils'
import WhitelistServiceInterface from './interface'

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
  ): Promise<Record<string, Space>> {
    const spaces = await this.snapshot.getSpaces()

    return Object.entries(spaces)
      .reduce<Space[]>((spaces, [snapshotId, space]) => {
        if (filterSpaces(minFollowers)(space)) {
          const _space = {
            followers: space.followers as number,
            snapshotId,
            snapshotName: space.name,
          }
          if (space.followers_7d !== undefined) {
            // @ts-expect-error
            _space.followers7d = space.followers_7d
          }
          spaces.push(_space)
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

  async getGhOrgs(
    snapshotNames: string[],
  ): Promise<Array<{ ghName: string; snapshotId: string }>> {
    const spaces = await this.snapshot.getGhOrgsBySpaceIds(snapshotNames)
    return spaces.reduce<Array<{ ghName: string; snapshotId: string }>>(
      (spaces, space) => {
        if (typeof space.ghName === 'string')
          spaces.push({ ghName: space.ghName, snapshotId: space.snapshotId })
        return spaces
      },
      [],
    )
  }

  async getOrgs(
    {
      maxOrgs,
      minFollowers,
    }: {
      maxOrgs?: number
      minFollowers?: number
    } = { maxOrgs: 100, minFollowers: 10_000 },
  ): Promise<
    Record<
      string,
      {
        followers: number
        followers7d: number
        snapshotId: string
        snapshotName: string
        ghName: string
        repos: string[]
      }
    >
  > {
    const spaces = await this.getSpaces({ maxOrgs, minFollowers })
    await Promise.all(
      split(Object.keys(spaces)).map(async (snapshotNames) => {
        const ghOrgs = await this.getGhOrgs(snapshotNames)

        await Promise.all(
          ghOrgs.map(async ({ ghName, snapshotId }) => {
            const repos = await this.gh.getReposByOrg(ghName)
            spaces[snapshotId].ghName = ghName
            spaces[snapshotId].repos = repos
          }),
        )
      }),
    )

    return spaces as Record<string, OrgData>
  }

  async refresh(): Promise<Org[]> {
    const orgs = await this.getOrgs()
    return this.db.upsertOrgs(Object.values(orgs))
  }

  async unWhitelist(ghNameOrSnapshotId: string): Promise<any> {
    return Promise.resolve('unimplemented')
  }
}
