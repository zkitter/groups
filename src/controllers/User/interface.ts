import { Request, Response } from 'express'

export default interface UserControllerInterface {
  refresh: (_: Request, res: Response) => Promise<void>
  getUser: (req: Request, res: Response) => Promise<void>
}
