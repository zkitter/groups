import { SNAPSHOT_API_URL } from './constants'
import { Space } from './types'

export const filterSpaces =
  (min: number) =>
  ({ followers, github }: Space) =>
    followers !== undefined && followers >= min && github !== undefined

export const getSpaces =
  ({ min = 10, size = 100 }: { min: number; size: number }) =>
  async () =>
    fetch(SNAPSHOT_API_URL).then(async (res) =>
      res.json().then((res) =>
        Object.values(res.spaces as Space[])
          .reduce<Space[]>((spaces, space) => {
            if (filterSpaces(min)(space)) {
              spaces.push(space)
            }
            return spaces
          }, [])
          // @ts-expect-error
          .sort((a, b) => b.followers - a.followers)
          .slice(0, size),
      ),
    )

export const get100TopDaosWithMin10kFollowers = getSpaces({
  min: 10_000,
  size: 0,
})
