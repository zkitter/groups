import { Service } from 'typedi'
import { URLS } from '#'
import { Space, SpaceGqlResponse, SpaceRestResponse, VoteResponse } from '../../types'
import SnapshotRepositoryInterface from './interface'
import { ghNamesBySpaceIdsQuery, votedSpacesByAddress } from './queries'

@Service()
export class SnapshotRepository implements SnapshotRepositoryInterface {
  headers: HeadersInit = { 'Content-Type': 'application/json' }

  private async gqlQuery(
    query: string,
    variables?: Record<string, unknown>,
  ): Promise<Record<string, any>> {
    const body: Record<string, unknown> = { query }
    if (variables !== undefined) body.variables = variables

    const res = await fetch(URLS.SNAPSHOT_GQL, {
      body: JSON.stringify({
        query,
        variables,
      }),
      headers: this.headers,
      method: 'POST',
    })

    return res.json()
  }

  async getSpaces(): Promise<
    Record<string, Space>
  > {
    const res = await fetch(URLS.SNAPSHOT_EXPLORE)
    const { spaces }: { spaces: SpaceRestResponse[] } = await res.json()
    return Object.entries(spaces).reduce<Record<string, Space>>(
      (spaces, [snapshotId, spaceResponse]) => {
        const space: Space = { followers: spaceResponse.followers, snapshotId, snapshotName: spaceResponse.name }
        if (spaceResponse.followers_7d !== undefined) {
          space.followers7d = spaceResponse.followers_7d
        }
        spaces[snapshotId] = space
        return spaces
      }, {})
  }

  async getGhNamesBySpaceIds(
    ids: string[],
  ): Promise<SpaceGqlResponse[]> {
    const { data } = await this.gqlQuery(ghNamesBySpaceIdsQuery, { ids })
    return data?.spaces ?? []
  }

  async getVotedSpacesByAddress(
    { address, since, until }: {
      address: string,
      since: number,
      until: number,
    },
  ): Promise<string[]> {

    const { data } = await this.gqlQuery(votedSpacesByAddress, {
      address, since, until,
    })

    return (data.votes ?? ([] as VoteResponse[])).reduce(
      (snapshotIds: string[], { space: { snapshotId } }: VoteResponse) => {
        if (!snapshotIds.includes(snapshotId)) snapshotIds.push(snapshotId)
        return snapshotIds
      },
      [],
    )
  }
}
