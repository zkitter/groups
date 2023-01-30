import { OrgData } from 'types'

export default interface MongoRepositoryInterface {
  findAllWhitelistedOrgs: () => Promise<OrgData[]>
  upsertOrg: (orgs: OrgData) => Promise<OrgData>
  upsertOrgs: (orgs: OrgData[]) => Promise<OrgData[]>
}
