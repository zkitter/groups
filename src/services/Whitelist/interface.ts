import { Org } from '@prisma/client'

export default interface WhitelistServiceInterface {
  getOrgs: () => Promise<Org[]>
  getRepos: () => Promise<string[]>
  getSpaceIds: () => Promise<string[]>
  addOrg: (org: Org) => Promise<Org>
  unWhitelist: (ghNameOrSnapshotId: string) => Promise<Org>
}
