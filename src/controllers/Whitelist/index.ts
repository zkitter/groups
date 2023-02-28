import { Request, Response } from 'express'
import { Service } from 'typedi'
import { WhitelistService } from 'services/Whitelist'
import WhitelistControllerInterface from './interface'

@Service()
export class WhitelistController implements WhitelistControllerInterface {
  constructor(readonly whitelistService: WhitelistService) {
  }

  async refresh(_: Request, res: Response) {
    const orgs = await this.whitelistService.refresh()
    res.json(orgs)
  }

  async getWhitelist(req: Request, res: Response) {
    const orgs = await this.whitelistService.getWhitelist(
      req.query.format as 'short' | 'long',
    )
    res.json(orgs)
  }

  async getWhitelistedDaos(_: Request, res: Response): Promise<void> {
    const daos = await this.whitelistService.getWhitelistedDaos()
    res.json(daos)
  }

  async getWhitelistedRepos(_: Request, res: Response): Promise<void> {
    const repos = await this.whitelistService.getWhitelistedRepos()
    res.json(repos)
  }
}
