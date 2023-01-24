import { ok } from 'assert'
import committersQuery from 'graphql/committers-query'
import { URLS } from '../constants'
import { parseDate } from '../utils'
import { GqlRepository } from './GqlRepository'

export class GithubRepository extends GqlRepository {
  constructor() {
    ok(process.env.GH_PAT, 'GH_PAT is not defined')
    super(URLS.GH_SQL, process.env.GH_PAT)
  }

  async getCommittersByOrg({
    org,
    since,
    until,
  }: {
    org: string
    since: Date
    until: Date
  }): Promise<Array<{ name: string; defaultBranchRef: any }>> {
    const res = await this.gqlQuery(committersQuery, {
      login: org,
      since: parseDate(since),
      until: parseDate(until),
    })

    return res?.data?.organization?.repositories?.nodes ?? []
  }
}
