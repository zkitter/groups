import { User } from '@prisma/client'
import { Response } from 'express'

export default interface UserControllerInterface {
  refresh: (_: Request, res: Response) => Promise<User>
  belongsToContributorGroup: (req: Request) => Promise<boolean>
  belongsToVotersGroup: (req: Request) => Promise<boolean>
}
