import { SnapshotRepository } from 'repositories'

const SPACE_IDS = ['stgdao.eth', 'ens.eth', 'aave.eth', 'uniswap']

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
    const spaces = await snapshotRepository.getGhNamesBySpaceIds(SPACE_IDS)

    expect(spaces)
      .toBeArray()
      .not.toBeEmpty()
      .toIncludeAllMembers([
        { ghName: 'stargate-protocol', snapshotId: 'stgdao.eth' },
        { ghName: 'aave', snapshotId: 'aave.eth' },
        { ghName: 'Uniswap', snapshotId: 'uniswap' },
        { ghName: 'ensdomains', snapshotId: 'ens.eth' },
      ])
    spaces.forEach(({ ghName, snapshotId }) => {
      expect(ghName).toBeString().not.toBeEmpty()
      expect(snapshotId).toBeString().not.toBeEmpty()
    })
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
