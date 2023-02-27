import {
  ArraySet,
  getTime,
  intersect,
  minusOneMonth,
  notBot,
  splitArray,
  splitTimestamps,
} from 'utils'

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
      const date = new Date('2021-02-01')
      const oneMonthAgo = new Date('2021-01-01')
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

  describe('intersect', () => {
    it('should return true if two arrays have at least one element in common', () => {
      expect(intersect(['a', 'b', 'c'], ['d', 'e', 'f', 'a'])).toBe(true)
    })

    it('should return false if the two arrays have no element in common', () => {
      expect(intersect(['a', 'b', 'c'], ['d', 'e', 'f'])).toBe(false)
    })
  })

  describe('splitArray', () => {
    it('should return a list of arrays with a given length', () => {
      const arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
      const chunkSize = 3
      const split = splitArray(arr, chunkSize)
      split.forEach((chunk) =>
        expect(chunk.length).toBeLessThanOrEqual(chunkSize),
      )
    })
  })

  describe('splitTimestamps', () => {
    it('should return a list of timestamps with a given length', () => {
      const since = 0
      const until = 111
      const chunks = 5
      const periods = splitTimestamps({ since, until }, chunks)
      expect(periods.length).toEqual(chunks)
      for (let i = 0; i < periods.length - 1; i++) {
        expect(periods[i][0]).toBeLessThanOrEqual(until)
        expect(periods[i][1]).toBeGreaterThanOrEqual(since)
        expect(periods[i][0]).toBeLessThan(periods[i][1])
        expect(periods[i][1]).toEqual(periods[i + 1][0] - 1)
      }
    })
  })
})
