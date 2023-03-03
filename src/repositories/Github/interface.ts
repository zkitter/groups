export default interface GithubRepositoryInterface {
  getContributedRepos: (
    username: string,
  ) => Promise<Array<{ name: string; org: string }>>
  getReposByOrg: (org: string) => Promise<string[]>
  getReposByOrgs: (orgs: string[]) => Promise<string[]>
  getCommittersByOrg: (org: string) => Promise<string[]>
}
