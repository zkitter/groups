import { ArraySet, getTime, minusOneMonth, notBot } from 'utils'

describe('utils', () => {
  describe('ArraySet', () => {
    it('should return a list of unique elements', () => {
      const arr = ['a', 'b', 'c', 'a', 'b', 'c']
      const set = ArraySet(arr)
      expect(set).toEqual(['a', 'b', 'c'])
    })
  })

  describe('minusOneMonth', () => {
    it('should return a date one month ago', () => {
      const date = new Date('2021-01-01')
      const oneMonthAgo = new Date('2020-12-01')
      expect(minusOneMonth(date)).toEqual(oneMonthAgo)
    })
  })

  describe('getTime', () => {
    it('should return number timestamp without milliseconds', () => {
      const date = new Date('2021-01-01')
      expect(getTime(date)).toEqual(1609459200)
    })
  })

  describe('notBot', () => {
    it('should return true if string does not contain [bot]', () => {
      expect(notBot('a')).toBe(true)
      expect(notBot('a[bot]')).toBe(false)
    })
  })
})
