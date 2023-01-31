import { GroupsData, UserData } from '../../types'

export default interface UserServiceInterface {
  getContributedRepos: (username: string) => Promise<string[]>
  belongsToGhContributorsGroup: (user: UserData | null) => Promise<boolean>
  belongsToVotersGroup: (user: UserData | null) => Promise<boolean>
  getGroups: (user: UserData | null) => Promise<GroupsData>
  getUser: (username: string) => Promise<UserData | GroupsData | null>
  refresh: (username: string) => Promise<UserData>
}
