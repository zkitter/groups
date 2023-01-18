import 'cross-fetch/polyfill'
import { Request, Response } from 'express'

import { get100TopDaosWithMin10kFollowers } from 'snapshot/get-spaces'

export default async (_: Request, res: Response) => {
  try {
    const spaces = await get100TopDaosWithMin10kFollowers()
    res.json(spaces)
  } catch (err) {
    res.status(500).json(err)
  }
}
