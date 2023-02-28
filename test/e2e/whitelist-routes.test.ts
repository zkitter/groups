import { faker } from '@faker-js/faker'
import request from 'supertest'
import { Container } from 'typedi'
import { app } from 'app'
import { MongoRepository } from 'repositories'
import { WhitelistService } from 'services/Whitelist'

const mongoRepository = Container.get(MongoRepository)
const whitelistService = Container.get(WhitelistService)

describe('Whitelist Controller', () => {
  jest.spyOn(whitelistService, 'getWhitelist')
  jest.spyOn(mongoRepository, 'findAllWhitelistedOrgs')

  describe('GET /whitelist', () => {
    it('return list of whitelisted orgs in short format by default', async () => {
      const { body } = await request(app).get('/whitelist').send()

      expect(whitelistService.getWhitelist).toHaveBeenCalledOnce()
      expect(mongoRepository.findAllWhitelistedOrgs).toHaveBeenCalledOnce()
      expect(body).toBeInstanceOf(Array)
      expect(body[faker.datatype.number({ max: body.length - 1, min: 0 })])
        .toBeString()
        .not.toBeEmpty()
    })

    it('can return list of whitelisted orgs in long format', async () => {
      const { body } = await request(app).get('/whitelist?format=long').send()
      const org = body[faker.datatype.number({ max: body.length - 1, min: 0 })]

      expect(whitelistService.getWhitelist).toHaveBeenCalledOnce()
      expect(mongoRepository.findAllWhitelistedOrgs).toHaveBeenCalledOnce()
      expect(body).toBeInstanceOf(Array)
      expect(org).toMatchObject({
        followers: expect.any(Number),
        snapshotId: expect.any(String),
        snapshotName: expect.any(String),
      })
      expect(org.ghName).toSatisfy(
        (ghName: any) => ghName === null || typeof ghName === 'string',
      )
      expect(org.repos).toBeArray()
    })

    it('GET /whitelist/refresh: should update and return the list of whitelisted orgs', async () => {
      jest.spyOn(whitelistService, 'refresh')
      jest.spyOn(mongoRepository, 'upsertOrgs')

      const { body } = await request(app).get('/whitelist/refresh').send()
      const org = body[faker.datatype.number({ max: body.length - 1, min: 0 })]

      expect(whitelistService.refresh).toHaveBeenCalledOnce()
      expect(mongoRepository.upsertOrgs).toHaveBeenCalledOnce()
      expect(body).toBeInstanceOf(Array)
      expect(org).toMatchObject({
        followers: expect.any(Number),
        snapshotId: expect.any(String),
        snapshotName: expect.any(String),
      })
      expect(org.ghName).toSatisfy(
        (ghName: any) => ghName === null || typeof ghName === 'string',
      )
      expect(org.repos).toBeArray()
    })
  })
})
