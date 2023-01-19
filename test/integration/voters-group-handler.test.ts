import express, { Express } from 'express'
import request from 'supertest'
import votersGroupHandler from 'handlers/voters-group'

let app: Express

beforeEach(() => {
  app = express()
  app.use(express.json())
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  app.post('/voters-group', votersGroupHandler)
})

describe('voters-group handler', () => {
  it('should return a list of voters (addresses)', async () => {
    const { body } = await request(app)
      .post('/voters-group')
      .send({})
      .expect(200)

    expect(body).toBeInstanceOf(Array)
    body.forEach((voter: string) => {
      expect(typeof voter).toBe('string')
      expect(voter.startsWith('0x')).toBe(true)
      expect(voter).toBeTruthy()
    })
  })

  describe('should return 400 if', () => {
    it.each([
      ['maxOrgs', 'integer', { maxOrgs: 'a' }],
      ['minFollowers', 'integer', { minFollowers: 'a' }],
      ['since', 'date', { since: 'a' }],
      ['until', 'date', { until: 'a' }],
    ])('%s is not a %s', async (field, type, body) => {
      const res = await request(app)
        .post('/voters-group')
        .send(body)
        .expect(400)

      const error = res.body.errors[0]
      expect(error.param).toEqual(field)
      expect(error.msg).toEqual('Invalid value')
    })
  })
})
