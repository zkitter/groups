import { Org } from '@prisma/client'

import { Service } from 'typedi'

import { Db } from 'db/mongo'
import { OrgData } from '../../types'
import MongoRepositoryInterface from './interface'

@Service()
export class MongoRepository implements MongoRepositoryInterface {
  constructor(readonly db: Db) {}

  async upsertOrg(org: OrgData): Promise<Org> {
    return this.db.org.upsert({
      create: { ...org },
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

  async upsertOrgs(orgs: OrgData[]): Promise<Org[]> {
    return Promise.all(orgs.map(this.upsertOrg))
  }
}
