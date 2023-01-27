import { PrismaClient } from '@prisma/client'
import { Service } from 'typedi'
import { Db } from 'db/prisma'
import { OrgData } from 'types'

import MongoRepositoryInterface from './interface'

@Service()
export class MongoRepository implements MongoRepositoryInterface {
  db: PrismaClient

  constructor(db: Db) {
    this.db = db.prisma
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
}
