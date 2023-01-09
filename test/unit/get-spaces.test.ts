import { get100TopDaosWithMin10kFollowers, getSpaces } from '../../src'

describe('getSpaces', () => {
  it('should return an array of spaces', async () => {
    const MIN = 20_000
    const SIZE = 50

    const spaces = await getSpaces({ min: MIN, size: SIZE })()

    expect(spaces.length).toBeGreaterThan(0)
    expect(spaces.length).toBeLessThanOrEqual(SIZE)
    spaces.forEach(({ followers, name }) => {
      expect(followers).toBeGreaterThanOrEqual(MIN)
      expect(name).toBeTruthy()
    })
  })
})

describe('getTop100DaosWithMin10kFollowers', () => {
  it('should return an array of spaces', async () => {
    const spaces = await get100TopDaosWithMin10kFollowers()

    expect(spaces.length).toBeLessThanOrEqual(100)
    spaces.forEach(({ followers }) => {
      expect(followers).toBeGreaterThanOrEqual(10_000)
    })
  })
})
