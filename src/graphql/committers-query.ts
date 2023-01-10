export default `
query orgs($login: String!) {
    organization(login: $login) {
        repositories(first: 100) {
            nodes {
                name
                defaultBranchRef {
                    name
                    target {
                        ... on Commit {
                            history(since: "2023-01-01T00:00:00Z") {
                                nodes {
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
