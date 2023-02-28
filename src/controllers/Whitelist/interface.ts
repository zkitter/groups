import { Request, Response } from 'express'

export default interface WhitelistControllerInterface {
  refresh: (_: Request, res: Response) => Promise<void>
  getWhitelist: (_: Request, res: Response) => Promise<void>
  getWhitelistedDaos: (_: Request, res: Response) => Promise<void>
  getWhitelistedRepos: (_: Request, res: Response) => Promise<void>
}
