import { filterSpaces } from '../../src/utils'

describe('filterSpaces', () => {
  const SPACE = { snapshotId: 'space.eth', snapshotName: 'space' }
  it('should return true if followers is greater than min and not on the ignore list', () => {
    const followers = 100
    const min = 10
    expect(filterSpaces(min)({ followers, ...SPACE })).toBe(true)
  })
  it('should return false if followers is less than min', () => {
    const followers = 10
    const min = 100
    expect(filterSpaces(min)({ followers, ...SPACE })).toBe(false)
  })

  it('should return false if followers is undefined', () => {
    const min = 100
    expect(filterSpaces(min)(SPACE)).toBe(false)
  })

  it('should return false if snapshotId in on the ignore list', () => {
    const followers = 100
    const min = 10
    expect(
      filterSpaces(min)({ followers, snapshotId: 'treasuredao.eth' }),
    ).toBe(false)
  })
})
