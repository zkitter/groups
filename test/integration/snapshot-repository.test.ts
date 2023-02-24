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
    const spaces = await snapshotRepository.getGhOrgsBySpaceIds(SPACE_IDS)

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

  it('gets voters by space ids', async () => {
    const voters = await snapshotRepository.getVoters(SPACE_IDS)

    expect(voters).toBeObject().not.toBeEmpty()
    Object.entries(voters).forEach(([snapshotId, voters]) => {
      expect(snapshotId).toBeString().not.toBeEmpty()
      expect(voters).toBeInstanceOf(Set)
      for (const voter of (voters as Set<string>).values()) {
        expect(voter).toBeString().toStartWith('0x')
      }
    })
  })
})
