// import { Container } from 'typedi'
import { Db } from 'db/prisma'
import { orgBuilder } from '../lib'

describe('Prisma (Mongo) DB', () => {
  const db = new Db()

  afterAll(async () => {
    await db.prisma.org.deleteMany()
    await db.prisma.$disconnect()
  })

  it('can create an org', async () => {
    const org = orgBuilder()
    const createdOrg = await db.prisma.org.create({ data: org })
    expect(createdOrg).toMatchObject(org)
  })
})
