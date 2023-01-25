import { PrismaClient } from '@prisma/client'
import { Service } from 'typedi'

@Service()
export class Db extends PrismaClient {
  constructor() {
    super({ errorFormat: 'minimal' })
  }
}
