import { Service } from 'typedi'
import { GithubRepository, SnapshotRepository } from 'repositories'
import { ArraySet, minusOneMonth, notBot } from 'utils'
import { CHUNK_SIZE } from '../constants'
import { filterSpaces } from '../snapshot/get-spaces'
import { Space } from '../types'

const split = (arr: string[]) => {
  const chunks = []
  for (let i = 0; i < arr.length; i += CHUNK_SIZE) {
    chunks.push(arr.slice(i, i + CHUNK_SIZE))
  }
  return chunks
}

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
    return Object.entries(spaces as Space[])
      .reduce<Array<{ id: string; followers: number }>>(
        (spaces, [id, space]) => {
          if (filterSpaces(minFollowers)(space)) {
            // @ts-expect-error - filterSpaces already ensures that props are defined
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
        if (repo.defaultBranchRef !== null)
          repos.push(
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
