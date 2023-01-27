import { getVotersGroup } from 'daos/get-voters-group'

describe('getVotersGroup', () => {
  it('should return a list of addresses', async () => {
    const voters = await getVotersGroup()
    expect(voters.length).toBeGreaterThan(0)
    voters.forEach((voter) => {
      expect(typeof voter).toBe('string')
      expect(voter).toBeTruthy()
      expect(voter.startsWith('0x')).toBeTruthy()
    })
    // no duplicates
    // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
    expect(Array.from(new Set(voters)).sort()).toEqual(voters.sort())
  })
})
