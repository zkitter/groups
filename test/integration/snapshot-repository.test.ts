import { SnapshotRepository } from 'repositories'

describe('SnapshotRepository', () => {
  let snapshotRepository: SnapshotRepository
  beforeEach(() => {
    snapshotRepository = new SnapshotRepository()
  })

  it('gets spaces key:value object', async () => {
    const spaces = await snapshotRepository.getSpaces()

    expect(spaces).toBeObject().not.toBeEmpty()
    expect(spaces['opcollective.eth']).toEqual(
      expect.objectContaining({
        followers: expect.any(Number),
        followers7d: expect.any(Number),
        snapshotId: expect.any(String),
        snapshotName: expect.any(String),
      }),
    )
  })

  it('gets github orgs by space ids', async () => {
    const SPACE_IDS = ['stgdao.eth', 'ens.eth', 'aave.eth', 'uniswap']
    const GH_NAMES = ['stargate-protocol', 'ensdomains', 'aave', 'Uniswap']
    const spaces = await snapshotRepository.getGhNamesBySpaceIds(SPACE_IDS)

    expect(spaces).toMatchObject(
      Object.fromEntries(
        SPACE_IDS.map((snapshotId, i) => [
          snapshotId,
          {
            ghName: GH_NAMES[i],
            snapshotId,
          },
        ]),
      ),
    )
  })

  it('gets ids of the spaces an address voted to', async () => {
    const spaceIds = await snapshotRepository.getVotedSpacesByAddress({
      address: '0x329c54289Ff5D6B7b7daE13592C6B1EDA1543eD4',
      since: 1674836517,
      until: 1677514917,
    })

    expect(spaceIds).toBeArray().not.toBeEmpty()
    expect(spaceIds).toInclude('aave.eth')
    spaceIds.forEach((spaceId) => {
      expect(spaceId).toBeString().not.toBeEmpty()
    })
  })
})
