// import { Org } from '@prisma/client'
import { OrgData } from 'types'

export default interface MongoRepositoryInterface {
  upsertOrg: (orgs: OrgData) => Promise<OrgData>
  upsertOrgs: (orgs: OrgData[]) => Promise<OrgData[]>
}
