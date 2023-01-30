import { Service } from 'typedi'
import { GithubRepository, MongoRepository } from 'repositories'
import { intersect } from '../../utils'
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

  async belongsToGhContributorsGroup(ghName: string): Promise<boolean> {
    const user = await this.db.findUser(ghName)
    if (user !== null) {
      const whitelistedRepos = await this.whitelist.getWhitelistShort()
      return intersect(whitelistedRepos, user.repos)
    }
    return false
  }

  async belongsToVotersGroup(ghName: string): Promise<boolean> {
    return Promise.resolve(false)
  }

  async refresh(ghName: string) {
    const repos = await this.getContributedRepos(ghName)
    return this.db.upsertUser({ ghName, repos })
  }
}
