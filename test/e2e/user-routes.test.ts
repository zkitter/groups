import request from 'supertest'
import { Container } from 'typedi'
import { app } from 'app'
import { MongoRepository } from 'repositories'
import { UserService } from 'services'

// beforeAll(async () => {
//
// })
describe('UserController', () => {
  const userService = Container.get(UserService)
  const mongoRepository = Container.get(MongoRepository)

  describe('GET /gh-user/:gh_username', () => {
    it('returns user in short format by default', async () => {
      const { body } = await request(app).get('/gh-user/r1oga').send()

      expect(body).toMatchObject({
        belongsToGhContributorsGroup: expect.any(Boolean),
      })
    })

    it('can return user in long format', async () => {
      const { body } = await request(app)
        .get('/gh-user/r1oga?format=long')
        .send()

      expect(body).toMatchObject({
        belongsToGhContributorsGroup: expect.any(Boolean),
        ghName: 'r1oga',
        repos: expect.any(Array),
      })
      expect(body.repos).toInclude('zkitter/groups')
    })
  })

  describe('GET /gh-user/:gh_username/refresh', () => {
    it('updates the user in the DB and returns the updated user', async () => {
      jest.spyOn(userService, 'refresh')
      jest.spyOn(mongoRepository, 'upsertUser')

      const { body } = await request(app).get('/gh-user/r1oga/refresh').send()

      expect(userService.refresh).toHaveBeenCalledOnce()
      expect(mongoRepository.upsertUser).toHaveBeenCalledOnce()
      expect(body).toMatchObject({
        ghName: 'r1oga',
        repos: expect.any(Array),
      })
      expect(body.repos).toInclude('zkitter/groups')
    })
  })

  describe('GET /membership/gh-contributors/:gh_username', () => {
    it('returns true if user belongs to the GH contributors group', async () => {
      await request(app).get('/gh-user/NoahZinsmeister/refresh').send()
      const { body } = await request(app)
        .get('/membership/gh-contributors/NoahZinsmeister')
        .send()

      expect(body).toEqual({ belongsToGhContributorsGroup: true })
    })

    it('returns false if user does not belong to the GH contributors group', async () => {
      const { body } = await request(app)
        .get('/membership/gh-contributors/r1oga')
        .send()

      expect(body).toEqual({ belongsToGhContributorsGroup: false })
    })
  })

  describe('GET /membership/voters/:address', () => {
    it('returns false if user does not belongs to the voters group', async () => {
      const { body } = await request(app)
        .get(
          '/membership/dao-voters/0xF411903cbC70a74d22900a5DE66A2dda66507255',
        )
        .send()

      expect(body).toEqual({ belongsToVotersGroup: false })
    })

    it('returns true if user belongs to the voters group', async () => {
      const { body } = await request(app)
        .get(
          '/membership/dao-voters/0x329c54289Ff5D6B7b7daE13592C6B1EDA1543eD4',
        ) // aavechan.eth
        .send()

      expect(body).toEqual({ belongsToVotersGroup: true })
    })
  })
})
