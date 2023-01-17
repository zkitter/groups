import { getGhOrgs } from '../../src/snapshot/get-gh-orgs'

describe('get-gh-orgs', () => {
  it('should return an array of github orgs', async () => {
    const MIN_FOLLOWERS = 20_000
    const MAX_ORGS = 5

    const orgs = await getGhOrgs({
      maxOrgs: MAX_ORGS,
      minFollowers: MIN_FOLLOWERS,
    })

    expect(orgs.length).toBeGreaterThan(0)
    expect(orgs.length).toBeLessThanOrEqual(MAX_ORGS)
    orgs.forEach((org) => {
      expect(org).toBeDefined().toBeTruthy()
    })
  })
})
