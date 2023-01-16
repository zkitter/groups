import { getGhGroup } from '../../src/get-gh-group'

jest.setTimeout(20_000)

describe('getGhGroup', () => {
  it('should return a list of users', async () => {
    const users = await getGhGroup({ maxOrgs: 5, minFollowers: 10_000 })
    expect(users.length).toBeGreaterThan(0)
    users.forEach((user) => {
      expect(typeof user).toBe('string')
      expect(user).toBeTruthy()
      expect(user.includes('[bot]')).toBeFalsy()
    })
    // no duplicates
    expect(Array.from(new Set(users)).sort()).toEqual(users.sort())
  })
})
