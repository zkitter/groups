import request from 'supertest'
import { Container } from 'typedi'
import { app } from 'app'
import { MongoRepository } from 'repositories'
import { WhitelistService } from 'services/Whitelist'

describe('refresh handler', () => {
  it('GET /whitelist: should return list of whitelisted orgs', async () => {
    const whitelistService = Container.get(WhitelistService)
    const mongoRepository = Container.get(MongoRepository)
    jest.spyOn(whitelistService, 'findAllWhitelistedOrgs')
    jest.spyOn(mongoRepository, 'findAllWhitelistedOrgs')

    const { body } = await request(app).get('/whitelist').send()

    expect(whitelistService.findAllWhitelistedOrgs).toHaveBeenCalledOnce()
    expect(mongoRepository.findAllWhitelistedOrgs).toHaveBeenCalledOnce()
    expect(body).toBeInstanceOf(Array)
    expect(body[0]).toMatchObject({
      followers: expect.any(Number),
      ghName: expect.any(String),
      repos: expect.any(Array<string>),
      snapshotId: expect.any(String),
      snapshotName: expect.any(String),
    })
  })

  it('GET /whitelist/refresh: should update and return the list of whitelisted orgs', async () => {
    const whitelistService = Container.get(WhitelistService)
    const mongoRepository = Container.get(MongoRepository)
    jest.spyOn(whitelistService, 'refresh')
    jest.spyOn(mongoRepository, 'upsertOrgs')

    const { body } = await request(app).get('/whitelist/refresh').send()

    // expect(s).toHaveBeenCalledOnce()
    // expect(ss).toHaveBeenCalledOnce()
    expect(body).toBeInstanceOf(Array)
    expect(body[0]).toMatchObject({
      followers: expect.any(Number),
      ghName: expect.any(String),
      repos: expect.any(Array<string>),
      snapshotId: expect.any(String),
      snapshotName: expect.any(String),
    })
  })
})
