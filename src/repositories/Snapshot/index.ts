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

  async getVoters(
    ids: string[],
    { since, until = new Date(0) }: { since?: Date; until?: Date } = {
      until: new Date(),
    },
  ) {
    if (since === undefined) since = minusOneMonth(until)

    const { data } = await this.gqlQuery(votersQuery, {
      created_gte: getTime(since),
      created_lte: getTime(until),
      space_in: ids,
    })

    return (data.votes ?? ([] as VoteResponse[])).reduce(
      (voters: Votes, vote: VoteResponse) => {
        const {
          space: { id: snapshotId },
          voter,
        } = vote
        if (voters[snapshotId] === undefined) voters[snapshotId] = new Set()
        voters[snapshotId].add(voter)
        return voters
      },
      {},
    )
  }
}
