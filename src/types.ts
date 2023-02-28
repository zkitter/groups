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

export interface SpaceRestResponse {
  followers: number
  followers_7d?: number
  name: string
}

export interface SpaceGqlResponse {
  snapshotId: string
  ghName: string | null
}

export interface VoteResponse {
  space: {
    snapshotId: string
  }
}

export type Votes = Record<string, Set<string>>
