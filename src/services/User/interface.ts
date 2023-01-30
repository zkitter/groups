import { UserData } from '../../types'

export default interface UserServiceInterface {
  getContributedRepos: (username: string) => Promise<string[]>
  belongsToContributorsGroup: (username: string) => Promise<boolean>
  belongsToVotersGroup: (username: string) => Promise<boolean>
  refresh: (username: string) => Promise<UserData>
}
