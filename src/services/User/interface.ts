import { User } from '@prisma/client'

export default interface UserServiceInterface {
  hasCommittedToSomeWhiteListedRepo: (username: string) => Promise<boolean>
  hasVotedToSomeWhitelistedDao: (username: string) => Promise<boolean>
  addUser: (user: User) => Promise<User>
  updateUser: (user: User) => Promise<User>
}
