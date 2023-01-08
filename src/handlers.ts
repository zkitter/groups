import { pipe } from 'fp-ts/function'
import * as TaskEither from 'fp-ts/TaskEither'
import { ParserError, ResponseError } from './errors'
import jsonParser from './json-parser'

export function onSuccess(response: Response) {
  return TaskEither.tryCatch(
    async () => jsonParser(response),
    (error) => new ParserError((error as Error).message),
  )
}

export function onFailure(response: Response) {
  return pipe(
    TaskEither.tryCatch(
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
    TaskEither.chain((e) => TaskEither.left(e)),
  )
}

export const handleResponse = (res: Response) =>
  res.ok ? onSuccess(res) : onFailure(res)
