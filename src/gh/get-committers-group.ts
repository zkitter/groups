import { getGhOrgs } from 'snapshot/get-gh-orgs'
import { minusOneMonth } from 'utils'
import { getCommittersByOrg } from './get-committers-by-org'

export const getCommittersGroup = async (
  {
    maxOrgs = 100,
    minFollowers = 10_000,
    since,
    until = new Date(),
  }: {
    maxOrgs?: number
    minFollowers?: number
    since?: Date
    until?: Date
  } = { maxOrgs: 100, minFollowers: 10_000, until: new Date() },
) => {
  if (since === undefined) since = minusOneMonth(until)
  const orgs = await getGhOrgs({ maxOrgs, minFollowers })

  const users = await Promise.all(
    orgs.map(async (org) => {
      // @ts-expect-error - type guarded earlier
      return getCommittersByOrg({ org, since, until })
    }),
  )
  return [...new Set(users.flat())].filter((user) => !user.includes('[bot]'))
}
