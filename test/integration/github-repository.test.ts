import { GithubRepository } from 'repositories'

describe('GithubRepository', () => {
  let ghRepository: GithubRepository
  beforeAll(() => {
    ghRepository = new GithubRepository()
  })

  it('get list of repos a user contributed to', async () => {
    const repos = await ghRepository.getContributedRepos('r1oga')

    expect(repos).toBeArray().not.toBeEmpty()
    repos.forEach(({ name, org }) => {
      expect(name).toBeString().not.toBeEmpty()
      expect(org).toBeString().not.toBeEmpty()
    })
  })

  it('get list of repos of 1 org', async () => {
    const repos = await ghRepository.getReposByOrg('uniswap')

    expect(repos).toBeArray().not.toBeEmpty()
    repos.forEach((repo) => {
      expect(repo).toBeString().not.toBeEmpty()
    })
  })

  it('get list of repos of multiple orgs', async () => {
    const repos = await ghRepository.getReposByOrgs([
      'uniswap',
      'ethereum-optimism',
    ])

    expect(repos)
      .toBeArray()
      .not.toBeEmpty()
      .toIncludeAllMembers(['optimism', 'unisocks'])
    repos.forEach((repo) => {
      expect(repo).toBeString().not.toBeEmpty()
    })
  })

  it('get list of committers by org', async () => {
    const committers = await ghRepository.getCommittersByOrg('uniswap')

    expect(committers).toBeArray().not.toBeEmpty()
    committers.forEach((committer) => {
      expect(committer).toBeString().not.toBeEmpty()
    })
  })
})
