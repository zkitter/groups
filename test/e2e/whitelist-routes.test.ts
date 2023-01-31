import request from 'supertest'
import { Container } from 'typedi'
import { app } from 'app'
import { MongoRepository } from 'repositories'
import { WhitelistService } from 'services/Whitelist'

describe('refresh handler', () => {
  const whitelistService = Container.get(WhitelistService)
  const mongoRepository = Container.get(MongoRepository)
  jest.spyOn(whitelistService, 'getWhitelist')
  jest.spyOn(mongoRepository, 'findAllWhitelistedOrgs')

  describe('GET /whitelist', () => {
    it('return list of whitelisted orgs in short format by default', async () => {
      const { body } = await request(app).get('/whitelist').send()

      expect(whitelistService.getWhitelist).toHaveBeenCalledOnce()
      expect(mongoRepository.findAllWhitelistedOrgs).toHaveBeenCalledOnce()
      expect(body).toBeInstanceOf(Array)
      expect(body[0]).toBeString().not.toBeEmpty()
    })

    it('can return list of whitelisted orgs in long format', async () => {
      const { body } = await request(app).get('/whitelist?format=long').send()

      expect(whitelistService.getWhitelist).toHaveBeenCalledOnce()
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
      jest.spyOn(whitelistService, 'refresh')
      jest.spyOn(mongoRepository, 'upsertOrgs')

      const { body } = await request(app).get('/whitelist/refresh').send()

      expect(whitelistService.refresh).toHaveBeenCalledOnce()
      expect(mongoRepository.upsertOrgs).toHaveBeenCalledOnce()
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
})
