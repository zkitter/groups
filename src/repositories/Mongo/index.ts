import { PrismaClient } from '@prisma/client'
import { Service } from 'typedi'
import { Db } from 'db/prisma'
import { OrgData, UserData } from 'types'

import MongoRepositoryInterface from './interface'

@Service()
export class MongoRepository implements MongoRepositoryInterface {
  db: PrismaClient

  constructor(db: Db) {
    this.db = db.prisma
  }

  async findAllWhitelistedOrgs() {
    return this.db.org.findMany({
      select: {
        followers: true,
        ghName: true,
        repos: true,
        snapshotId: true,
        snapshotName: true,
      },
    })
  }

  upsertOrg(org: OrgData) {
    return this.db.org.upsert({
      create: org,
      select: {
        followers: true,
        ghName: true,
        repos: true,
        snapshotId: true,
        snapshotName: true,
      },
      update: {
        followers: org.followers,
        followers7d: org.followers7d,
        repos: org.repos,
      },
      where: {
        snapshotId: org.snapshotId,
      },
    })
  }

  async upsertOrgs(orgs: OrgData[]): Promise<OrgData[]> {
    return this.db.$transaction(orgs.map((org) => this.upsertOrg(org)))
  }

  async findUser(ghName: string) {
    return this.db.user.findUnique({
      select: {
        ghName: true,
        repos: true,
      },
      where: { ghName },
    })
  }

  async upsertUser(user: UserData) {
    return this.db.user.upsert({
      create: user,
      select: {
        ghName: true,
        repos: true,
      },
      update: {
        repos: user.repos,
      },
      where: {
        ghName: user.ghName,
      },
    })
  }
}
