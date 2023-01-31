import { Service } from 'typedi'
import { GithubRepository, MongoRepository } from 'repositories'
import { GroupsData, UserData } from 'types'
import { intersect } from 'utils'
import { WhitelistService } from '../Whitelist'
import UserServiceInterface from './interface'

@Service()
export class UserService implements UserServiceInterface {
  constructor(
    readonly gh: GithubRepository,
    readonly db: MongoRepository,
    readonly whitelist: WhitelistService,
  ) {}

  async getContributedRepos(ghName: string) {
    const repos = await this.gh.getContributedRepos(ghName)
    return repos.map(({ name, org }) => `${org}/${name}`)
  }

  async belongsToGhContributorsGroup(user: UserData | null): Promise<boolean> {
    if (user !== null) {
      const whitelistedRepos = await this.whitelist.getWhitelistShort()
      return intersect(whitelistedRepos, user.repos)
    }
    return false
  }

  async belongsToVotersGroup(user: UserData | null): Promise<boolean> {
    return Promise.resolve(false)
  }

  async getGroups(user: UserData | null): Promise<GroupsData> {
    const [belongsToGhContributorsGroup] = await Promise.all([
      this.belongsToGhContributorsGroup(user),
    ])
    return { belongsToGhContributorsGroup }
  }

  async getUser(ghName: string, format: 'short' | 'long' = 'short') {
    const user = await this.db.findUser(ghName)
    const groups = await this.getGroups(user)
    if (format === 'short') return groups
    return { ...groups, ...user }
  }

  async refresh(ghName: string) {
    const repos = await this.getContributedRepos(ghName)
    return this.db.upsertUser({ ghName, repos })
  }
}
