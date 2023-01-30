import { OrgData, UserData } from 'types'

export default interface MongoRepositoryInterface {
  findAllWhitelistedOrgs: () => Promise<OrgData[]>
  upsertOrg: (orgs: OrgData) => Promise<OrgData>
  upsertOrgs: (orgs: OrgData[]) => Promise<OrgData[]>
  findUser: (username: string) => Promise<UserData | null>
  upsertUser: (user: UserData) => Promise<UserData>
}
