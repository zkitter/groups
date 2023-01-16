import 'cross-fetch/polyfill'
import { Request, Response } from 'express'

import { getGhGroup } from '../src'

export default async (_: Request, res: Response) => {
  try {
    const group = await getGhGroup()
    res.status(200).json(group)
  } catch (err) {
    res.status(500).json(err)
  }
}
