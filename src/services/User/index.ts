import { Service } from 'typedi'
import {
  GithubRepository,
  MongoRepository,
  SnapshotRepository,
} from 'repositories'
import { UserData } from 'types'
import { getTime, intersect, minusOneMonth } from 'utils'
import { WhitelistService } from '../Whitelist'
import UserServiceInterface from './interface'

@Service()
export class UserService implements UserServiceInterface {
  constructor(
    readonly gh: GithubRepository,
    readonly db: MongoRepository,
    readonly snapshot: SnapshotRepository,
    readonly whitelist: WhitelistService,
  ) {}

  async getContributedRepos(ghName: string) {
    const repos = await this.gh.getContributedRepos(ghName)
    return repos.map(({ name, org }) => `${org}/${name}`)
  }

  async getVotedOrgs({
    address,
    since,
    until = new Date(),
  }: {
    address: string
    since?: Date
    until?: Date
  }) {
    if (since === undefined) since = minusOneMonth(until)
    return this.snapshot.getVotedSpacesByAddress({
      address,
      since: getTime(since),
      until: getTime(until),
    })
  }

  async belongsToGhContributorsGroup(user: UserData | null): Promise<boolean> {
    if (user !== null) {
      const { repos } = await this.whitelist.getWhitelistShort()
      return intersect(repos, user.repos)
    }
    return false
  }

  async belongsToVotersGroup(address: string): Promise<boolean> {
    const votedOrgs = await this.getVotedOrgs({ address })
    const { daos } = await this.whitelist.getWhitelistShort()
    return intersect(daos, votedOrgs)
  }

  async getGhUser(ghName: string, format: 'short' | 'long' = 'short') {
    const user = await this.db.findUser(ghName)
    const belongsToGhContributorsGroup =
      user === null ? false : await this.belongsToGhContributorsGroup(user)
    if (format === 'short') return { belongsToGhContributorsGroup }
    return { ...user, belongsToGhContributorsGroup }
  }

  async refresh(ghName: string) {
    const repos = await this.getContributedRepos(ghName)
    return this.db.upsertUser({ ghName, repos })
  }
}
