import { URLS } from './constants'
import { getSpaces } from './get-spaces'
import spacesGqlQuery from './graphql/spaces-gql-query'

export const getGhOrgs = async ({
  min,
  size,
}: {
  min: number
  size: number
}): Promise<string[]> => {
  const spacesIds = (await getSpaces({ min, size })()).map(({ id }) => id)

  const res = await fetch(URLS.SNAPSHOT_GQL, {
    body: JSON.stringify({
      operationName: 'Spaces',
      query: spacesGqlQuery,
      variables: { id_in: spacesIds },
    }),
    headers: { 'Content-Type': 'application/json' },
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
