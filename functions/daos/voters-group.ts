import 'cross-fetch/polyfill'
import { getVotersGroup } from 'daos/get-voters-group'

import { Request, Response } from 'express'

export default async (_: Request, res: Response) => {
  try {
    const group = await getVotersGroup()
    res.status(200).json(group)
  } catch (err) {
    res.status(500).json(err)
  }
}
