import { Org } from '@prisma/client'
import { OrgData, Space } from 'types'

export default interface WhitelistServiceInterface {
  getSpaces: ({
    maxOrgs,
    minFollowers,
  }: {
    maxOrgs?: number
    minFollowers?: number
  }) => Promise<Record<string, Space>>

  getGhOrgs: (
    snapshotNames: string[],
  ) => Promise<Array<{ ghName: string; snapshotId: string }>>

  getOrgsWithRepos: ({
    maxOrgs,
    minFollowers,
  }: {
    maxOrgs?: number
    minFollowers?: number
  }) => Promise<Record<string, OrgData>>
  unWhitelist: (ghNameOrSnapshotId: string) => Promise<Org>
  getWhitelistShort: () => Promise<string[]>
  getWhitelist: (format: 'short' | 'long') => Promise<OrgData[] | string[]>
  refresh: () => Promise<OrgData[]>
}
