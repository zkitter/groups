import {
  get100TopDaosWithMin10kFollowers,
  getSpaces,
} from '../../src/get-spaces'

describe('getSpaces', () => {
  it('should return an array of spaces', async () => {
    const MIN_FOLLOWERS = 20_000
    const MAX_ORGS = 50

    const spaces = await getSpaces({
      maxOrgs: MAX_ORGS,
      minFollowers: MIN_FOLLOWERS,
    })()

    expect(spaces.length).toBeGreaterThan(0)
    expect(spaces.length).toBeLessThanOrEqual(MAX_ORGS)
    spaces.forEach(({ followers, id }) => {
      expect(id).toBeDefined().toBeTruthy()
      expect(followers).toBeGreaterThan(MIN_FOLLOWERS)
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
