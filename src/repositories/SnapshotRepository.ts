import spacesGqlQuery from 'graphql/spaces-gql-query'
import { URLS } from '../constants'
import { GqlRepository } from './GqlRepository'

export class SnapshotRepository extends GqlRepository {
  constructor() {
    super(URLS.SNAPSHOT_GQL)
  }

  async getSpaces(): Promise<Record<string, unknown>> {
    const res = await fetch(URLS.SNAPSHOT_EXPLORE)
    const { spaces } = await res.json()
    return spaces
  }

  async getGhOrgBySpaceIds(ids: string[]): Promise<Array<{ github: string }>> {
    const res = await this.gqlQuery(spacesGqlQuery, { id_in: ids })
    return res?.data?.spaces
  }
}
