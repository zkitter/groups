import { ok } from 'assert'
import { URLS } from './constants'
import committersQuery from './graphql/committers-query'

const parseDate = (date: Date) => date.toISOString().split('.')[0] + 'Z'

export const getCommittersByOrg = async ({
  org,
  since,
  until,
}: {
  org: string
  since: Date
  until: Date
}) => {
  // console.log(parseDate(since), parseDate(until))
  ok(process.env.GH_PAT, 'GH_PAT is not defined')
  const res = await fetch(URLS.GH_SQL, {
    body: JSON.stringify({
      query: committersQuery,
      variables: {
        login: org,
        since: parseDate(since),
        until: parseDate(until),
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
        .reduce<string[][]>((repos, repo) => {
          // console.log(repo)
          if (repo.defaultBranchRef !== null) {
            repos.push(
              (repo.defaultBranchRef.target.history.nodes as any[]).reduce<
                string[]
              >((users, node) => {
                const login: string = node.author.user?.login
                if (login !== undefined) users.push(login)
                return users
              }, []),
            )
          }
          return repos
        }, [])
        .flat(),
    ),
  ]
}
