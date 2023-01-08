import { pipe } from 'fp-ts/function'
import { isLeft } from 'fp-ts/lib/Either'
import { filter } from 'fp-ts/Record'
import { chain, tryCatch } from 'fp-ts/TaskEither'
import { URL } from './constants'
import { NetworkError } from './errors'
import { handleResponse } from './handlers'
import { Space } from './types'

const getSpaces = pipe(
  tryCatch(
    async () => fetch(URL),
    (error) => new NetworkError((error as Error).message),
  ),
  chain(handleResponse),
)

const moreThanOneHundredFollowers = (space: Space) => space.followers > 100

const main = async () => {
  const result = await getSpaces()

  if (isLeft(result)) {
    console.error(result.left)
  } else {
    // @ts-expect-error
    console.log(pipe(result.right.spaces, filter(moreThanOneHundredFollowers)))
  }
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch(() => {
    process.exit(1)
  })
