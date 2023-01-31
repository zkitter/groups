import { Request, Response } from 'express'

export default interface WhitelistControllerInterface {
  refresh: (_: Request, res: Response) => Promise<void>
  getWhitelist: (_: Request, res: Response) => Promise<void>
}
