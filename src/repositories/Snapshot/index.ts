import { Service } from 'typedi'
import { URLS } from '#'
import { ArraySet, getTime, minusOneMonth } from 'utils'
import SnapshotRepositoryInterface from './interface'
import { spacesQuery, votersQuery } from './queries'

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

  async getSpaces(): Promise<Record<string, any>> {
    const res = await fetch(URLS.SNAPSHOT_EXPLORE)
    const { spaces } = await res.json()
    return spaces
  }

  async getGhOrgsBySpaceIds(ids: string[]): Promise<string[]> {
    const { data } = await this.gqlQuery(spacesQuery, { id_in: ids })
    const spaces = data?.spaces ?? []
    return spaces.map(({ github }: { github: string }) => github)
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

    return ArraySet(
      (data.votes as Array<{ voter: string }>).map(({ voter }) => voter),
    )
  }
}
