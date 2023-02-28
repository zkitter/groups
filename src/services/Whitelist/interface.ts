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

  getOrgsWithRepos: ({
    maxOrgs,
    minFollowers,
  }: {
    maxOrgs?: number
    minFollowers?: number
  }) => Promise<Record<string, OrgData>>
  unWhitelist: (ghNameOrSnapshotId: string) => Promise<Org>
  getWhitelist: (format: 'short' | 'long') => Promise<OrgData[] | { daos: string[], repos: string[] }>
  getWhitelistedDaos: () => Promise<string[]>
  getWhitelistedRepos: () => Promise<string[]>
  refresh: () => Promise<OrgData[]>
}
