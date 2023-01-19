import { Request, Response } from 'express'
import { validate } from './validate'

export const Handler =
  (fetchFn: (arg0: any) => any) => async (req: Request, res: Response) => {
    try {
      const errors = await validate(req, res)
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() })
      const data = await fetchFn(req.body)
      res.status(200).json(data)
    } catch (err) {
      res.status(500).json(err)
    }
  }
