import { getSpaces, getTop100SpacesWithMoreThan10000Followers } from '../../src'
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
  it('should return an array of spaces', async () => {
    // @ts-expect-error
    const { right: spaces } = await getTop100SpacesWithMoreThan10000Followers()
    console.log(spaces)
    expect(spaces).toBeInstanceOf(Array)
    expect(spaces.length).toBe(100)
    expect(spaces.length).toBe(100)
    spaces.forEach((space: Space) => {
      expect(space.name).toBeTruthy()
      expect(space.followers).toBeGreaterThanOrEqual(10000)
      expect(space.github).toBeTruthy()
    })
  })
})
