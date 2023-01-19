import { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'

const validations = [
  body('maxOrgs').if(body('maxOrgs').exists()).isInt(),
  body('minFollowers').if(body('minFollowers').exists()).isInt(),
  body('since').if(body('since').exists()).isDate(),
  body('until').if(body('until').exists()).isDate(),
]

export const validate = async (req: Request, res: Response) => {
  await Promise.all(validations.map(async (validation) => validation.run(req)))
  return validationResult(req)
}
