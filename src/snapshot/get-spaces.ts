import { URLS } from '../constants'
import { Space } from '../types'

export const filterSpaces =
  (minFollowers: number) =>
  ({ followers }: Space) =>
    followers !== undefined && followers >= minFollowers

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
            // @ts-expect-error - filterSpaces already ensures that props are defined
            spaces.push({ followers: space.followers, id })
          }

          return spaces
        },
        [],
      )
      .sort((a, b) => b.followers - a.followers)
      .slice(0, maxOrgs)
  }

export const get100TopDaosWithMin10kFollowers = getSpaces()
