import express, { Express } from 'express'
import request from 'supertest'
import committersGroupHandler from 'handlers/committers-group'

let app: Express

beforeEach(() => {
  app = express()
  app.use(express.json())
})

describe('committers-group handler', () => {
  it('should return a list of committers', async () => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    app.post('/committers-group', committersGroupHandler)
    const { body } = await request(app)
      .post('/committers-group')
      .send({})
      .expect(200)

    expect(body).toBeInstanceOf(Array)
    body.forEach((committer: unknown) => {
      expect(typeof committer).toBe('string')
      expect(committer).toBeTruthy()
    })
  })
})
