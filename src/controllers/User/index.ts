import { Request, Response } from 'express'
import { Service } from 'typedi'
import { UserService } from 'services/User'
import UserControllerInterface from './interface'

@Service()
export class UserController implements UserControllerInterface {
  constructor(readonly userService: UserService) {}

  async getUser(req: Request, res: Response) {
    const { ghUsername } = req.params
    const user = await this.userService.getGhUser(
      ghUsername,
      req.query.format as 'short' | 'long',
    )
    res.json(user)
  }

  async refresh(req: Request, res: Response) {
    const { ghUsername } = req.params
    const user = await this.userService.refresh(ghUsername)
    res.json(user)
  }

  async belongsToGhContributorsGroup(
    req: Request,
    res: Response,
  ): Promise<void> {
    const { ghUsername } = req.params
    const belongsToGhContributorsGroup = await this.userService.getGhUser(
      ghUsername,
    )
    res.json(belongsToGhContributorsGroup)
  }

  async belongsToVotersGroup(req: Request, res: Response): Promise<void> {
    const { address } = req.params
    const belongsToVotersGroup = await this.userService.belongsToVotersGroup(
      address,
    )
    res.json({ belongsToVotersGroup })
  }
}
