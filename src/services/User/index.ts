import { User } from '@prisma/client'
import { MongoRepository } from 'repositories/Mongo'
import UserServiceInterface from './interface'

export class UserService implements UserServiceInterface {
  constructor(readonly db: MongoRepository) {}
  async addUser(user: User): Promise<any> {
    return Promise.resolve()
  }

  async hasCommittedToSomeWhiteListedRepo(username: string): Promise<boolean> {
    return Promise.resolve(false)
  }

  async hasVotedToSomeWhitelistedDao(username: string): Promise<boolean> {
    return Promise.resolve(false)
  }

  async updateUser(user: User): Promise<any> {
    return Promise.resolve()
  }
}
