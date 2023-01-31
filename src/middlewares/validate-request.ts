import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'

import { RequestValidationError } from 'errors'

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req)
  console.log(errors)
  if (!errors.isEmpty()) {
    /* Instead of returning a response object with a status 400
        throw an error to force it being caught
        by the error handler middleware
       return res.status(400).send(errors.array())
      */
    throw new RequestValidationError(errors.array())
  }

  next()
}
