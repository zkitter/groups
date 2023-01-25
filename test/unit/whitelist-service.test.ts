import { mock } from 'jest-mock-extended'
import { MongoRepository } from 'repositories/Mongo'
import { WhitelistService } from 'services/Whitelist'
import { orgBuilder } from '../lib'

describe('WhitelistService', () => {
  let whitelistService: WhitelistService
  const db = mock<MongoRepository>()

  beforeEach(() => {
    whitelistService = new WhitelistService(db)
  })

  it('add org', async () => {
    const org = orgBuilder()
    db.createOrg.mockResolvedValueOnce(org)
    const createdOrg = await whitelistService.addOrg(org)

    expect(createdOrg).toEqual(org)
  })
})
