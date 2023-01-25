import { Octokit } from '@octokit/core'
import { graphql } from '@octokit/graphql'
import { paginateGraphql } from '@octokit/plugin-paginate-graphql'
import { ok } from 'assert'
import { Service } from 'typedi'
import GithubRepositoryInterface from './interface'
import contributedReposByUserQuery from './queries/contributed-repos-by-user'
import reposByOrgQuery from './queries/repos-by-org'

@Service()
export class GithubRepository implements GithubRepositoryInterface {
  client: Octokit & {
    graphql: typeof graphql & {
      paginate: (
        query: string,
        initialParameters?: Record<string, any> | undefined,
      ) => Promise<any>
    }
  }

  constructor() {
    ok(process.env.GH_PAT, 'GH_PAT is not defined')
    const PaginatedOctokit = Octokit.plugin(paginateGraphql)
    this.client = new PaginatedOctokit({ auth: process.env.GH_PAT })
  }

  async getContributedRepos(login: string) {
    const { user } = await this.client.graphql.paginate(
      contributedReposByUserQuery,
      { login },
    )
    const nodes = user?.repositoriesContributedTo?.nodes ?? []
    return nodes.map(
      ({
        name,
        owner: { login },
      }: {
        name: string
        owner: { login: string }
      }) => ({ name, org: login }),
    )
  }

  async getReposByOrg(org: string): Promise<string[]> {
    const { organization } = await this.client.graphql.paginate(
      reposByOrgQuery,
      { org },
    )
    const nodes = organization?.repositories?.nodes ?? []
    return nodes.map(({ name }: { name: string }) => name)
  }

  async getReposByOrgs(orgs: string[]): Promise<string[]> {
    return Promise.resolve([])
  }
}
