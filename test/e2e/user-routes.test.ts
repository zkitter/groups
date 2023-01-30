import request from 'supertest'
import { Container } from 'typedi'
import { app } from 'app'
import { MongoRepository } from 'repositories'
import { UserService } from 'services'

describe('UserController', () => {
  const userService = Container.get(UserService)
  const mongoRepository = Container.get(MongoRepository)

  describe('GET /user/:username', () => {
    it('returns object describing the groups the users belongs to', async () => {
      const { body } = await request(app).get('/user/r1oga').send()

      expect(body).toMatchObject({
        belongsToGhContributorsGroup: expect.any(Boolean),
      })
    })
  })

  describe('GET /user/:username/refresh', () => {
    it('updates the user in the DB and returns the updated user', async () => {
      jest.spyOn(userService, 'refresh')
      jest.spyOn(mongoRepository, 'upsertUser')

      const { body } = await request(app).get('/user/r1oga/refresh').send()

      expect(userService.refresh).toHaveBeenCalledOnce()
      expect(mongoRepository.upsertUser).toHaveBeenCalledOnce()
      expect(body).toMatchObject({
        ghName: 'r1oga',
        repos: expect.any(Array<string>),
      })
      expect(body.repos).toInclude('zkitter/groups')
    })
  })
})
