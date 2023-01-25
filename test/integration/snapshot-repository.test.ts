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
        'stargate-protocol',
        'Uniswap',
        'aave',
        'ensdomains',
      ])
    spaces.forEach((github) => {
      expect(github).toBeString().not.toBeEmpty()
    })
  })

  it('gets voters by space ids', async () => {
    const voters = await snapshotRepository.getVoters(SPACE_IDS)

    expect(voters).toBeArray().not.toBeEmpty()
    voters.forEach((voter) => {
      expect(voter).toBeString().not.toBeEmpty().toStartWith('0x')
    })
  })
})
