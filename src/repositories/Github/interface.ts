export default interface GithubRepositoryInterface {
  // getCommitters: (org: string, {
  //   since,
  //   until,
  // }: {
  //   org: string
  //   since: Date
  //   until: Date
  // }) => Promise<Array<{ name: string; defaultBranchRef: any }>>

  getContributedRepos: (
    username: string,
  ) => Promise<Array<{ name: string; org: string }>>
  getReposByOrg: (org: string) => Promise<string[]>
  getReposByOrgs: (orgs: string[]) => Promise<string[]>
}
