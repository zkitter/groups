import { Space } from 'types'
import { URLS } from '../constants'
import { filterSpaces } from '../utils'

export const getSpaces =
  (
    {
      maxOrgs = 100,
      minFollowers = 10_000,
    }: { minFollowers: number; maxOrgs: number } = {
      maxOrgs: 100,
      minFollowers: 10_000,
    },
  ) =>
  async () => {
    const res = await fetch(URLS.SNAPSHOT_EXPLORE)
    const { spaces } = await res.json()

    return Object.entries(spaces as Space[])
      .reduce<Array<{ id: string; followers: number }>>(
        (spaces, [id, space]) => {
          if (filterSpaces(minFollowers)(space)) {
            spaces.push({ followers: space.followers, id })
          }

          return spaces
        },
        [],
      )
      .sort((a, b) => b.followers - a.followers)
      .slice(0, maxOrgs)
      .map(({ id }) => id)
  }

export const get100TopDaosWithMin10kFollowers = getSpaces()
