import { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { CHUNK_SIZE } from '#'
import { IGNORE_SPACES } from './services/Whitelist/ignore-list'

export const minusOneMonth = (date: Date) =>
  new Date(new Date(date).setMonth(date.getMonth() - 1))

export const getTime = (date: Date) => Math.floor(date.getTime() / 1000)

export const ArraySet = <T>(array: T[]) => [...new Set(array)]

export const notBot = (str: string) => !str.includes('[bot]')

export const parseDate = (date: Date) => date.toISOString().split('.')[0] + 'Z'

export const split = <T>(arr: T[], chunkSize = CHUNK_SIZE): T[][] => {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize))
  }
  return chunks
}

const isIncluded = (ignoreList: string[]) => (str?: string) =>
  str === undefined ? true : !ignoreList.includes(str)

export const filterSpaces =
  (minFollowers: number) =>
  ({ followers, snapshotId }: any) =>
    followers !== undefined &&
    followers >= minFollowers &&
    isIncluded(IGNORE_SPACES)(snapshotId)

const validations = [
  body('maxOrgs').if(body('maxOrgs').exists()).isInt(),
  body('minFollowers').if(body('minFollowers').exists()).isInt(),
  body('since').if(body('since').exists()).isDate(),
  body('until').if(body('until').exists()).isDate(),
]

export const validate = async (req: Request, res: Response) => {
  await Promise.all(validations.map(async (validation) => validation.run(req)))
  return validationResult(req)
}

export const intersect = (a: string[], b: string[]) => {
  const setA = new Set(a)
  const setB = new Set(b)
  return new Set([...setA].filter((x) => setB.has(x))).size > 0
}
