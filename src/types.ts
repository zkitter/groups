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
  followers7d?: number
  snapshotId: string
  snapshotName: string
  ghName: string
  repos: string[]
  voters?: string[]
}

export interface UserData {
  ghName: string
  repos: string[]
}

export interface GroupsData {
  belongsToGhContributorsGroup: boolean
}

export interface SpaceResponse {
  snapshotId: string
  ghName: string
}

export interface VoteResponse {
  voter: string
  space: {
    id: string
  }
}

export type Votes = Record<string, Set<string>>
