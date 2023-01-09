import { filterSpaces } from '../../src'

describe('filterSpaces', () => {
  it('should return true if followers is greater than min and github is defined', () => {
    const followers = 100
    const min = 10
    expect(
      filterSpaces(min)({ followers, github: 'github', name: 'name' }),
    ).toBe(true)
  })
  it('should return false if followers is less than min', () => {
    const followers = 10
    const min = 100
    expect(
      filterSpaces(min)({ followers, github: 'github', name: 'name' }),
    ).toBe(false)
  })

  it('should return false if followers is undefined', () => {
    const followers = undefined
    const min = 100
    expect(
      filterSpaces(min)({ followers, github: 'github', name: 'name' }),
    ).toBe(false)
  })

  it('should return false if github is undefined', () => {
    const followers = 100
    const min = 100
    expect(
      filterSpaces(min)({ followers, github: undefined, name: 'name' }),
    ).toBe(false)
  })
})
