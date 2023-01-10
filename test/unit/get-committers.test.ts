import { getCommittersByOrg } from '../../src/get-commiters-by-org'

describe('getCommitters', () => {
  it('should return a list of committers', async () => {
    const committers = await getCommittersByOrg('uniswap')

    expect(committers.length).toBeGreaterThan(0)
    committers.forEach((committer) => {
      expect(typeof committer).toBe('string')
      expect(committer).toBeTruthy()
    })
  })
})
