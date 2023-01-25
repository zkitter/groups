import { Org, User } from '@prisma/client'

import { Service } from 'typedi'

import { Db } from 'db/mongo'

@Service()
export class MongoRepository {
  constructor(readonly db: Db) {}

  async createOrg(org: Org) {
    return this.db.org.create({ data: org })
  }

  async storeUser(user: User) {
    return this.db.user.create({ data: user })
  }

  // update({ id, name }: Item) {
  //   return this.db.item.update({ data: { name }, where: { id } })
  // }

  async findAllUsers() {
    return this.db.user.findMany()
  }

  async findAllOrgs() {
    return this.db.org.findMany()
  }

  findOneUser(ghName: string) {
    return this.db.user.findUnique({ where: { ghName } })
  }

  // delete(id: number) {
  //   return this.db.item.delete({ where: { id } })
  // }
}
