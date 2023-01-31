export const contributedReposByUserQuery = `
 query getContributedRepos($login: String!, $cursor: String) {
    user(login: $login) {
      repositoriesContributedTo(first: 100, after: $cursor, contributionTypes: [COMMIT], includeUserRepositories: true)       {
        nodes {
          name
          owner {
            login
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
 `
