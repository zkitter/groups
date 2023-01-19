import { Request, Response } from 'express'
import { ValidationChain, validationResult } from 'express-validator'

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response) => {
    await Promise.all(
      validations.map(async (validation) => validation.run(req)),
    )

    const errors = validationResult(req)
    if (!errors.isEmpty()) res.status(400).json({ errors: errors.array() })
  }
}
