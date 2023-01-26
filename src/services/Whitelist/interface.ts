import { Org } from '@prisma/client'
import { Space } from '../../types'

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

  getOrgs: ({
    maxOrgs,
    minFollowers,
  }: {
    maxOrgs?: number
    minFollowers?: number
  }) => Promise<
    Record<
      string,
      {
        followers: number
        followers7d: number
        snapshotId: string
        snapshotName: string
        ghName: string
        repos: string[]
      }
    >
  >
  unWhitelist: (ghNameOrSnapshotId: string) => Promise<Org>
  refresh: () => Promise<Org[]>
}
