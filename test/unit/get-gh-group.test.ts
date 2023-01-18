import { getCommitersGroup } from 'gh/get-commiters-group'

describe('getGhGroup', () => {
  it('should return a list of users', async () => {
    const users = await getCommitersGroup({ maxOrgs: 5, minFollowers: 10_000 })
    expect(users.length).toBeGreaterThan(0)
    users.forEach((user) => {
      expect(typeof user).toBe('string')
      expect(user).toBeTruthy()
      expect(user.includes('[bot]')).toBeFalsy()
    })
    // no duplicates
    // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
    expect(Array.from(new Set(users)).sort()).toEqual(users.sort())
  })
})
