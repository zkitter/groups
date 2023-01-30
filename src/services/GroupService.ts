import { Service } from 'typedi'
import { GithubRepository, SnapshotRepository } from 'repositories'
import { ArraySet, filterSpaces, minusOneMonth, notBot, split } from 'utils'
import { Space } from '../types'

@Service()
export class GroupService {
  constructor(
    readonly ghRepository: GithubRepository,
    readonly snapshotRepository: SnapshotRepository,
  ) {}

  private async getSpaceIds(
    {
      maxOrgs = 100,
      minFollowers = 10_000,
    }: { minFollowers: number; maxOrgs: number } = {
      maxOrgs: 100,
      minFollowers: 10_000,
    },
  ) {
    const spaces = await this.snapshotRepository.getSpaces()
    // @ts-expect-error
    return Object.entries(spaces as Space[])
      .reduce<Array<{ id: string; followers: number }>>(
        (spaces, [id, space]) => {
          if (filterSpaces(minFollowers)(space)) {
            spaces.push({ followers: space.followers, id })
          }

          return spaces
        },
        [],
      )
      .sort((a, b) => b.followers - a.followers)
      .slice(0, maxOrgs)
      .map(({ id }) => id)
  }

  private async getGhOrgsChunk(ids: string[]) {
    const spaces = await this.snapshotRepository.getGhOrgsBySpaceIds(ids)
    return spaces.reduce<string[]>((spaces, github) => {
      // @ts-expect-error
      if (github !== null) spaces.push(github)
      return spaces
    }, [])
  }

  private async getGhOrgs(
    {
      maxOrgs = 100,
      minFollowers = 10_000,
    }: {
      minFollowers: number
      maxOrgs: number
    } = { maxOrgs: 100, minFollowers: 10_000 },
  ): Promise<string[]> {
    const spacesIds = await this.getSpaceIds({ maxOrgs, minFollowers })
    const orgs = await Promise.all(split(spacesIds).map(this.getGhOrgsChunk))
    return ArraySet(orgs.flat())
  }

  async getCommittersGroup(
    {
      maxOrgs = 100,
      minFollowers = 10_000,
      since,
      until = new Date(),
    }: {
      maxOrgs?: number
      minFollowers?: number
      since?: Date
      until?: Date
    } = {
      maxOrgs: 100,
      minFollowers: 10_000,
      until: new Date(),
    },
  ) {
    if (since === undefined) since = minusOneMonth(until)
    const orgs = await this.getGhOrgs({ maxOrgs, minFollowers })
    const nodes = (
      await Promise.all(
        orgs.map(async (org) =>
          // @ts-expect-error - since already type guarded
          this.ghRepository.getCommittersByOrg({
            org,
            since,
            until,
          }),
        ),
      )
    ).flat()

    const committers = nodes
      .reduce<string[][]>((repos, repo) => {
        // @ts-expect-error
        if (repo.defaultBranchRef !== null)
          repos.push(
            // @ts-expect-error
            (repo.defaultBranchRef.target.history.nodes as any[]).reduce<
              string[]
            >((users, node) => {
              const login: string = node.author.user?.login
              if (login !== undefined) users.push(login)
              return users
            }, []),
          )

        return repos
      }, [])
      .flat()

    return ArraySet(committers).filter(notBot)
  }

  // async getVotersGroup() {}
  // async createUser() {}
  // async createOrg() {}
  // async findOneUser(){}
  // async findOneOrg(){}
}
