import { Request, Response } from 'express'
import { Service } from 'typedi'
import { UserService } from 'services/User'
import UserControllerInterface from './interface'

@Service()
export class UserController implements UserControllerInterface {
  constructor(readonly userService: UserService) {}

  async getUser(req: Request, res: Response) {
    const { username } = req.params
    const user = await this.userService.getUser(
      username,
      req.query.format as 'short' | 'long',
    )
    res.json(user)
  }

  async refresh(req: Request, res: Response) {
    const { username } = req.params
    const user = await this.userService.refresh(username)
    res.json(user)
  }
}
