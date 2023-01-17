import spacesGqlQuery from 'graphql/spaces-gql-query'
import { CHUNK_SIZE, URLS } from '../constants'
import { getSpaces } from './get-spaces'

const split = (arr: string[]) => {
  const chunks = []
  for (let i = 0; i < arr.length; i += CHUNK_SIZE) {
    chunks.push(arr.slice(i, i + CHUNK_SIZE))
  }
  return chunks
}

const getChunk = async (ids: string[]) => {
  const res = await fetch(URLS.SNAPSHOT_GQL, {
    body: JSON.stringify({
      query: spacesGqlQuery,
      variables: { id_in: ids },
    }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })
  const { data } = await res.json()

  return (data.spaces as Array<{ github: string }>).reduce<string[]>(
    (spaces, { github }) => {
      if (github !== null) spaces.push(github)
      return spaces
    },
    [],
  )
}
export const getGhOrgs = async (
  {
    maxOrgs = 100,
    minFollowers = 10_000,
  }: {
    minFollowers: number
    maxOrgs: number
  } = { maxOrgs: 100, minFollowers: 10_000 },
): Promise<string[]> => {
  const spacesIds = (await getSpaces({ maxOrgs, minFollowers })()).map(
    ({ id }) => id,
  )

  const result = new Set<string>()

  await Promise.all(
    split(spacesIds).map(async (ids) => {
      const chunk = await getChunk(ids)
      chunk.forEach((org) => result.add(org))
    }),
  )

  return Array.from(result)
}
