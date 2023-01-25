import { Octokit } from '@octokit/core'
import { paginateGraphql } from '@octokit/plugin-paginate-graphql'
import { ok } from 'assert'
import { Service } from 'typedi'
// import committersQuery from 'graphql/committers-query'
// import { parseDate } from '../utils'

@Service()
export class GithubRepository {
  client: any

  constructor() {
    ok(process.env.GH_PAT, 'GH_PAT is not defined')
    const PaginatedOctokit = Octokit.plugin(paginateGraphql)
    this.client = new PaginatedOctokit({ auth: process.env.GH_PAT })
  }

  // async getCommittersByOrg({
  //                            org,
  //                            since,
  //                            until,
  //                          }: {
  //   org: string
  //   since: Date
  //   until: Date
  // }): Promise<Array<{ name: string; defaultBranchRef: any }>> {
  //   const res = await this.gqlQuery(committersQuery, {
  //     login: org,
  //     since: parseDate(since),
  //     until: parseDate(until),
  //   })
  //
  //   return res?.data?.organization?.repositories?.nodes ?? []
  // }
}
