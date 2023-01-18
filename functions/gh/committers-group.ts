import 'cross-fetch/polyfill'
import { Request, Response } from 'express'

import { getCommittersGroup } from 'gh/get-committers-group'

export default async (_: Request, res: Response) => {
  try {
    const group = await getCommittersGroup()
    res.status(200).json(group)
  } catch (err) {
    res.status(500).json(err)
  }
}
