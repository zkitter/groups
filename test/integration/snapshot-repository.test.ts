import { SnapshotRepository } from 'repositories/SnapshotRepository'

describe('SnapshotRepository', () => {
  let snapshotRepository: SnapshotRepository
  beforeEach(() => {
    snapshotRepository = new SnapshotRepository()
  })

  it('gets spaces key:value object', async () => {
    const spaces = await snapshotRepository.getSpaces()
    expect(spaces).toBeObject().not.toBeEmpty()
    expect(Object.values(spaces)).toBeArray().not.toBeEmpty()
    expect(spaces['opcollective.eth']).toEqual(
      expect.objectContaining({
        followers: expect.any(Number),
        followers_7d: expect.any(Number),
        name: expect.any(String),
      }),
    )
  })

  it('gets github orgs by space ids', async () => {
    const SPACE_IDS = ['stgdao.eth', 'ens.eth', 'aave.eth', 'uniswap']
    const spaces = await snapshotRepository.getGhOrgBySpaceIds(SPACE_IDS)
    expect(spaces).toBeArray().not.toBeEmpty()
    spaces.forEach(({ github }) => {
      expect(github).toBeString().not.toBeEmpty()
    })
  })
})
