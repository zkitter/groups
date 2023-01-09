import { URLS } from './constants'
import { Space } from './types'

export const filterSpaces =
  (min: number) =>
  ({ followers }: Space) =>
    followers !== undefined && followers >= min

export const getSpaces =
  ({ min = 10, size = 100 }: { min: number; size: number }) =>
  async () =>
    fetch(URLS.EXPLORE).then(async (res) =>
      res.json().then((res) =>
        Object.entries(res.spaces as Space[])
          .reduce<Array<{ id: string; followers: number }>>(
            (spaces, [id, space]) => {
              if (filterSpaces(min)(space)) {
                // @ts-expect-error - filterSpaces already ensures that props are defined
                spaces.push({ followers: space.followers, id })
              }

              return spaces
            },
            [],
          )
          .sort((a, b) => b.followers - a.followers)
          .slice(0, size),
      ),
    )

export const get100TopDaosWithMin10kFollowers = getSpaces({
  min: 10_000,
  size: 0,
})
