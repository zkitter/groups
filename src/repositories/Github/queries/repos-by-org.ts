export default `
query orgs($org: String!, $cursor: String) {
    organization(login: $org) {
        repositories(first: 100, after: $cursor) {
            nodes {
                name
            },
            pageInfo {
                endCursor
                hasNextPage
            }
        }
    }
}
`
