import { Octokit } from '@octokit/core'
import { graphql } from '@octokit/graphql'
import { paginateGraphql } from '@octokit/plugin-paginate-graphql'
import { ok } from 'assert'
import { Service } from 'typedi'
import { ArraySet } from 'utils'
import GithubRepositoryInterface from './interface'
import {
  committersByOrgQuery,
  contributedReposByUserQuery,
  reposByOrgQuery,
} from './queries'

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

  async getContributedRepos(
    login: string,
  ): Promise<Array<{ name: string; org: string }>> {
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
    try {
      const { organization } = await this.client.graphql.paginate(
        reposByOrgQuery,
        { org },
      )
      const nodes = organization?.repositories?.nodes ?? []
      return nodes.map(({ name }: { name: string }) => name)
    } catch (e) {
      // catching all
      // observed error: Could not resolve to an Organization with the login of 'arbi-s'
      return []
    }
  }

  async getReposByOrgs(orgs: string[]): Promise<string[]> {
    return Promise.all(orgs.map(async (org) => this.getReposByOrg(org))).then(
      (repos) => repos.flat(),
    )
  }

  async getCommittersByOrg(org: string): Promise<string[]> {
    const { organization } = await this.client.graphql.paginate(
      committersByOrgQuery,
      { org },
    )
    const nodes = organization?.repositories?.nodes ?? []
    return ArraySet(
      (nodes as any[])
        .reduce<string[][]>((repos, repo) => {
          if (repo.defaultBranchRef !== null)
            repos.push(
              (repo.defaultBranchRef.target.history.nodes as any[]).reduce<
                string[]
              >((users, node) => {
                const login: string = node.author.user?.login
                if (login !== undefined) users.push(login)
                return users
              }, []),
            )

          return repos
        }, [])
        .flat(),
    )
  }
}
