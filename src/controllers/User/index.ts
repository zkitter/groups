import { Request, Response } from 'express'
import { Service } from 'typedi'
import { UserService } from 'services/User'
import UserControllerInterface from './interface'

@Service()
export class UserController implements UserControllerInterface {
  constructor(readonly userService: UserService) {}

  async getGroups(req: Request, res: Response) {
    const { username } = req.params
    const [belongsToGhContributorsGroup] = await Promise.all([
      this.userService.belongsToGhContributorsGroup(username),
    ])
    res.json({ belongsToGhContributorsGroup })
  }

  async refresh(req: Request, res: Response) {
    const { username } = req.params
    const user = await this.userService.refresh(username)
    res.json(user)
  }
}
