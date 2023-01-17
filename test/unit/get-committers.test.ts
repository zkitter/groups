import { getCommittersByOrg } from 'gh/get-commiters-by-org'

describe('getCommitters', () => {
  it('should return a list of committers', async () => {
    const ORG = 'uniswap'
    const SINCE = new Date('2022-12-01')
    const UNTIL = new Date('2023-01-01')

    const committers = await getCommittersByOrg({
      org: ORG,
      since: SINCE,
      until: UNTIL,
    })

    expect(committers.length).toBeGreaterThan(0)
    committers.forEach((user) => {
      expect(typeof user).toBe('string')
      expect(user).toBeTruthy()
    })
  })
})
