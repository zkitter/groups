import { ok } from 'assert'
import { URLS } from './constants'
import committersQuery from './graphql/committers-query'

export const getCommittersByOrg = async ({
  org,
  since,
  until,
}: {
  org: string
  since: Date
  until: Date
}) => {
  ok(process.env.GH_PAT, 'GH_PAT is not defined')
  const res = await fetch(URLS.GH_SQL, {
    body: JSON.stringify({
      query: committersQuery,
      variables: {
        login: org,
        since: since.toISOString(),
        until: until.toISOString(),
      },
    }),
    headers: {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      Authorization: `bearer ${process.env.GH_PAT}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })

  const repos = (await res.json()).data.organization.repositories.nodes

  return [
    ...new Set(
      (repos as any[])
        .reduce<Array<{ date: string; user: string }>>((repos, repo) => {
          // console.log(repo)
          if (repo.defaultBranchRef !== null) {
            repos.push(
              repo.defaultBranchRef.target.history.nodes.map((node: any) => ({
                date: node.committedDate,
                user: node.author.user.login,
              })),
            )
          }
          return repos
        }, [])
        .flat(),
    ),
  ]
}
