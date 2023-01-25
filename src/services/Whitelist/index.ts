import { Org } from '@prisma/client'
import { MongoRepository } from '../../repositories/MongoRepository'
import WhitelistServiceInterface from './interface'

export class WhitelistService implements WhitelistServiceInterface {
  constructor(readonly db: MongoRepository) {}
  async addOrg(org: Org): Promise<Org> {
    return this.db.createOrg(org)
  }

  async getOrgs(): Promise<Org[]> {
    return Promise.resolve([])
  }

  async getRepos(): Promise<string[]> {
    return Promise.resolve([])
  }

  async getSpaceIds(): Promise<string[]> {
    return Promise.resolve([])
  }

  async unWhitelist(ghNameOrSnapshotId: string): Promise<any> {
    return Promise.resolve(undefined)
  }
}
