import { ok } from 'assert'
import { committersByOrgQuery } from 'repositories/Github/queries'
import { ArraySet, parseDate } from 'utils'
import { URLS } from '../constants'

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
      query: committersByOrgQuery,
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
  const repos = (await res.json()).data?.organization?.repositories?.nodes

  if (repos === undefined) return []

  return ArraySet(
    (repos as any[])
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
