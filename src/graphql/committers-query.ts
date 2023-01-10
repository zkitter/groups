export default `
query orgs($login: String!, $since: GitTimestamp!, $until: GitTimestamp!) {
    organization(login: $login) {
        repositories(first: 100) {
            nodes {
                name
                defaultBranchRef {
                    name
                    target {
                        ... on Commit {
                            history(since: $since, until: $until) {
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
        }
    }
}

`
