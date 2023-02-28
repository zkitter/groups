import { Service } from 'typedi'
import { URLS } from '#'
import { SpaceResponse, VoteResponse } from '../../types'
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
    Record<string, { name: string; followers?: number; followers_7d?: number }>
  > {
    const res = await fetch(URLS.SNAPSHOT_EXPLORE)
    const { spaces } = await res.json()
    return spaces
  }

  async getGhNamesBySpaceIds(
    ids: string[],
  ): Promise<SpaceResponse[]> {
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
