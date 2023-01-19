import { Request, Response } from 'express'
import { ValidationChain } from 'express-validator'
import { validate } from './validate'

export const Handler =
  (fetchFn: (arg0: any) => any, validations: ValidationChain[]) =>
  async (req: Request, res: Response) => {
    try {
      await validate(validations)(req, res)
      const data = await fetchFn(req.body)
      res.status(200).json(data)
    } catch (err) {
      res.status(500).json(err)
    }
  }
