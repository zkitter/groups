import { URLS } from './constants'
import { Space } from './types'

export const filterSpaces =
  (minFollowers: number) =>
  ({ followers }: Space) =>
    followers !== undefined && followers >= minFollowers

export const getSpaces =
  (
    {
      maxOrgs = 100,
      minFollowers = 10,
    }: { minFollowers: number; maxOrgs: number } = {
      maxOrgs: 100,
      minFollowers: 10_000,
    },
  ) =>
  async () =>
    fetch(URLS.SNAPSHOT_EXPLORE).then(async (res) =>
      res.json().then((res) =>
        Object.entries(res.spaces as Space[])
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
          .slice(0, maxOrgs),
      ),
    )

export const get100TopDaosWithMin10kFollowers = getSpaces()
