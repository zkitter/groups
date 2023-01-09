import { getGhOrgs } from '../../src/get-gh-orgs'

describe('get-gh-orgs', () => {
  it('should return an array of github orgs', async () => {
    const MIN = 20_000
    const SIZE = 5

    const orgs = await getGhOrgs({ min: MIN, size: SIZE })

    expect(orgs.length).toBeGreaterThan(0)
    expect(orgs.length).toBeLessThanOrEqual(SIZE)
    orgs.forEach((org) => {
      expect(org).toBeDefined().toBeTruthy()
    })
  })
})
