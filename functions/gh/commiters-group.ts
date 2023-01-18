import 'cross-fetch/polyfill'
import { Request, Response } from 'express'

import { getCommitersGroup } from 'gh/get-commiters-group'

export default async (_: Request, res: Response) => {
  try {
    const group = await getCommitersGroup()
    res.status(200).json(group)
  } catch (err) {
    res.status(500).json(err)
  }
}
