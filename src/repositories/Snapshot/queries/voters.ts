export const votersQuery = `
query Voters($space_in: [String], $created_gte: Int, $created_lte: Int){
  votes (
    where: {
      created_gte: $created_gte
      created_lte: $created_lte
      space_in: $space_in
      vp_state: "final"
    }
    orderBy: "created",
    orderDirection: desc
  ) {
    voter
  }
}
`
