import 'cross-fetch/polyfill'
import { Request, Response } from 'express'
import { getCommittersGroup } from 'gh/get-committers-group'
import { coerceDates } from 'handlers/Handler'
import { validate } from 'handlers/validate'

export default async (req: Request, res: Response) => {
  try {
    const errors = await validate(req, res)
    console.log({ errors })
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() })
    const data = await getCommittersGroup(
      coerceDates(['since', 'until'], req.body),
    )
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json(err)
  }
}
