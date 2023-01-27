import express from 'express'
import request from 'supertest'
import refreshHandler from 'handlers/refresh'

describe('refresh handler', () => {
  const app = express()
  app.use(express.json())
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  app.get('/refresh', refreshHandler)

  it('should return the list of whitelisted orgs', async () => {
    const { body } = await request(app).get('/refresh').send()

    expect(body).toBeInstanceOf(Array)
    expect(body[0]).toMatchObject({
      followers: expect.any(Number),
      ghName: expect.any(String),
      repos: expect.any(Array<string>),
      snapshotId: expect.any(String),
      updatedAt: expect.any(String),
    })
  })
})
