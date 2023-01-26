export interface Space {
  followers: number
  followers7d?: number
  snapshotId: string
  snapshotName: string
  ghName?: string
  repos?: string[]
}

export interface OrgData {
  followers: number
  followers7d: number
  snapshotId: string
  snapshotName: string
  ghName: string
  repos: string[]
}
