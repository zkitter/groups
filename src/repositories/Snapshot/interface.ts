import { SpaceResponse } from '../../types'

export default interface SnapshotRepositoryInterface {
  getSpaces: () => Promise<Record<string, any>>
  getGhNamesBySpaceIds: (
    ids: string[],
  ) => Promise<SpaceResponse[]>
  getVotedSpacesByAddress: (
    { address, since, until }: {
      since: number; until: number; address: string,
    },
  ) => Promise<string[]>
}
