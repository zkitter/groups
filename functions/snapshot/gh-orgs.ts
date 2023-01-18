import 'cross-fetch/polyfill'
import { Request, Response } from 'express'

import { getGhOrgs } from 'snapshot/get-gh-orgs'

export default async (_: Request, res: Response) => {
  try {
    const orgs = await getGhOrgs()
    res.status(200).json(orgs)
  } catch (err) {
    res.status(500).json(err)
  }
}
