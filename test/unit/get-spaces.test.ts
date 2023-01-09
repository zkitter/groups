import { getSpaces } from '../../src'
import { Space } from '../../src/types'

describe('getSpaces', () => {
  it('should return an array of spaces', async () => {
    // @ts-expect-error
    const { right: spaces } = await getSpaces(20_000)()
    expect(spaces).toBeInstanceOf(Array)
    spaces.forEach((space: Space) => {
      expect(space.name).toBeTruthy()
      expect(space.followers).toBeGreaterThanOrEqual(20_000)
      expect(space.github).toBeTruthy()
    })
  })
})

describe.skip('getTop100SpacesWithMoreThan10000Followers', () => {
  it.todo('should return an array of spaces')
})
