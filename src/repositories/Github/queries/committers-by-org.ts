export const committersByOrgQuery = `
query orgs($org: String!, $cursor: String) {
    organization(login: $org) {
        repositories(first: 100, after: $cursor) {
            nodes {
                name
                defaultBranchRef {
                    name
                    target {
                        ... on Commit {
                            history(since: "2022-12-01T00:00:00Z", until: "2023-01-10T00:00:00Z") {
                                nodes {
                                    committedDate
                                    author {
                                        user {
                                            login
                                        }
                                    }
                                }
                            }
                        }
                    }
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
