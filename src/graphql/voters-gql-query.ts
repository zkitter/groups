export default `
query Voters($space_in: [String], $created_gte: Int){
  votes (
    where: {
      created_gte: $created_gte
      space_in: $space_in
      vp_state: "final"
    }
    orderBy: "created",
    orderDirection: desc
  ) {
    voter
    created
    space {
      id
    }
  }
}
`
