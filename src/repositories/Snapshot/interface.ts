import { Space, SpaceGqlResponse } from 'types'

export default interface SnapshotRepositoryInterface {
  getSpaces: () => Promise<Record<string, Space>>
  getGhNamesBySpaceIds: (
    ids: string[],
  ) => Promise<Record<string, SpaceGqlResponse>>
  getVotedSpacesByAddress: ({
    address,
    since,
    until,
  }: {
    since: number
    until: number
    address: string
  }) => Promise<string[]>
}
