import { URLS } from './constants'
import committersQuery from './graphql/committers-query'

const GH_PAT = process.env
if (GH_PAT === undefined) throw new Error('GH_PAT is not defined')

// const pickLogin : ()
export const getCommittersByOrg = async (org: string) => {
  const res = await fetch(URLS.GH_SQL, {
    body: JSON.stringify({
      query: committersQuery,
      variables: { login: org },
    }),
    headers: {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      Authorization: `bearer ${process.env.GH_PAT}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })

  const r = await res.json()
  const repos = r.data.organization.repositories.nodes
  // const repos = (await res.json()).data.organization.repositories.nodes
  // console.log(repos)

  return [
    ...new Set(
      (repos as any[])
        .reduce<string[]>((repos, repo) => {
          // console.log(repo)
          if (repo.defaultBranchRef !== null) {
            repos.push(
              repo.defaultBranchRef.target.history.nodes.map(
                (node: any) => node.author.user.login,
              ),
            )
          }
          return repos
        }, [])
        .flat(),
    ),
  ]
}
