import { GroupsData, UserData } from 'types'

export default interface UserServiceInterface {
  getContributedRepos: (username: string) => Promise<string[]>
  getVotedOrgs: ({
    address,
    since,
    until,
  }: {
    address: string
    since?: Date
    until?: Date
  }) => Promise<string[]>
  belongsToGhContributorsGroup: (user: UserData | null) => Promise<boolean>
  belongsToVotersGroup: (address: string) => Promise<boolean>
  getGhUser: (username: string) => Promise<UserData | GroupsData | null>
  refresh: (username: string) => Promise<UserData>
}
