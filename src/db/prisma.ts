import { PrismaClient } from '@prisma/client'
import { Service } from 'typedi'

@Service()
export class Db {
  prisma = new PrismaClient({ errorFormat: 'minimal' })
}
