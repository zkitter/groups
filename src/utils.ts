import { CHUNK_SIZE } from '#'

export const minusOneMonth = (date: Date) =>
  new Date(new Date(date).setMonth(date.getMonth() - 1))

export const getTime = (date: Date) => Math.floor(date.getTime() / 1000)

export const ArraySet = <T>(array: T[]) => [...new Set(array)]

export const notBot = (str: string) => !str.includes('[bot]')

export const parseDate = (date: Date) => date.toISOString().split('.')[0] + 'Z'

export const split = (arr: string[]) => {
  const chunks = []
  for (let i = 0; i < arr.length; i += CHUNK_SIZE) {
    chunks.push(arr.slice(i, i + CHUNK_SIZE))
  }
  return chunks
}
