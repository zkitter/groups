import { Request, Response } from 'express'
import { Container } from 'typedi'
import { WhitelistService } from 'services/Whitelist'

const whitelistService = Container.get(WhitelistService)
const refresh = whitelistService.refresh.bind(whitelistService)

const refreshHandler = async (req: Request, res: Response) => {
  try {
    const orgs = await refresh()
    res.status(200).json(orgs)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

export default refreshHandler
