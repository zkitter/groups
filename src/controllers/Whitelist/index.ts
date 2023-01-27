import { Request, Response } from 'express'
import { Service } from 'typedi'
import { WhitelistService } from 'services/Whitelist'
import WhitelistControllerInterface from './interface'

@Service()
export class WhitelistController implements WhitelistControllerInterface {
  constructor(readonly whitelistService: WhitelistService) {}

  async refresh(_: Request, res: Response) {
    const orgs = await this.whitelistService.refresh()
    res.json(orgs)
  }
}
