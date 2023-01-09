import { pipe } from 'fp-ts/function'
import { chain, left, tryCatch } from 'fp-ts/TaskEither'
import { ParserError, ResponseError } from './errors'
import jsonParser from './json-parser'
import { Space } from './types'

export function onSuccess(response: Response) {
  return tryCatch<Error, { spaces: Record<string, Space> }>(
    async () => jsonParser(response),
    (error) => new ParserError((error as Error).message),
  )
}

export function onFailure(response: Response) {
  return pipe(
    tryCatch(
      async () =>
        jsonParser(response).then(
          (body) =>
            new ResponseError(response.statusText, response.status, body),
        ),
      (error) =>
        new ResponseError(
          response.statusText,
          response.status,
          null,
          new ParserError((error as Error).message),
        ),
    ),
    chain((e) => left(e)),
  )
}

export const handleResponse = (res: Response) =>
  res.ok ? onSuccess(res) : onFailure(res)
