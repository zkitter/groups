import { Request, Response } from 'express'

export default interface UserControllerInterface {
  refresh: (_: Request, res: Response) => Promise<void>
  getGroups: (req: Request, res: Response) => Promise<void>
}
