import { GithubRepository } from 'repositories/GithubRepository'

describe('GithubRepository', () => {
  it('gets committers by org', async () => {
    const ghRepository = new GithubRepository()
    const ORG = 'uniswap'
    const SINCE = new Date('2022-12-01')
    const UNTIL = new Date('2023-01-01')
    const repos = await ghRepository.getCommittersByOrg({
      org: ORG,
      since: SINCE,
      until: UNTIL,
    })

    expect(repos).toBeArray().not.toBeEmpty()
    const repo = repos.filter(({ name }) => name === 'interface')[0]
    expect(repo.defaultBranchRef.target.history.nodes)
      .toBeArray()
      .not.toBeEmpty()
    const committers = repo.defaultBranchRef.target.history.nodes
    expect(committers).toBeArray().not.toBeEmpty()
    // @ts-expect-error
    committers.forEach(({ author, committedDate }) => {
      expect(new Date(committedDate)).toBeDate().toBeBefore(UNTIL)
      expect(new Date(committedDate)).toBeDate().toBeAfter(SINCE)
      expect(author.user.login).toBeString().not.toBeEmpty()
    })
  })
})
