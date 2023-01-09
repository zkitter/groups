import { sort, takeRight } from 'fp-ts/Array'
import { pipe } from 'fp-ts/function'
import * as N from 'fp-ts/number'
import { contramap, Ord } from 'fp-ts/Ord'
import { reduceWithIndex } from 'fp-ts/Record'
import { Ord as StringOrd } from 'fp-ts/string'
import { chain, map, tryCatch } from 'fp-ts/TaskEither'
import { URL } from './constants'
import { NetworkError } from './errors'
import { handleResponse } from './handlers'
import { Space } from './types'

const moreThanMinFollower = (min: number) => (space: Space) =>
  space.followers > min
const orderByFollowers: Ord<Space> = pipe(
  N.Ord,
  contramap((space: Space) => space.followers),
)
const hasGithub = (space: Space) => space.github !== undefined

export const getSpaces = (min: number) =>
  pipe(
    tryCatch(
      async () => fetch(URL),
      (error) => new NetworkError((error as Error).message),
    ),
    chain(handleResponse),
    map((result) => result.spaces),
    map(
      reduceWithIndex(StringOrd)([] as Space[], (k, acc, space) => {
        if (moreThanMinFollower(min)(space) && hasGithub(space)) {
          return [...acc, space]
        } else {
          return acc
        }
      }),
    ),
    map(sort(orderByFollowers)),
  )

export const getTop100SpacesWithMoreThan10000Followers = pipe(
  getSpaces(10000),
  map(takeRight(100)),
)
