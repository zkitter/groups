import { GithubRepository } from 'repositories/Github'
import GithubRepositoryInterface from '../../src/repositories/Github/interface'

describe('GithubRepository', () => {
  let ghRepository: GithubRepositoryInterface
  beforeAll(() => {
    ghRepository = new GithubRepository()
  })

  it('get list of repos a user contributed to', async () => {
    const repos = await ghRepository.getContributedRepos('r1oga')
    console.log(repos)
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
})
