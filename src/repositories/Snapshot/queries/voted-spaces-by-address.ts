export const votedSpacesByAddress = `
query VotedSpacesByAddress($address: String!, $since: Int!, $until: Int!) {
  votes (
    where: {
      created_gte: $since,
      created_lte: $until,
      voter_in: [$address],
      vp_state: "final"
    }
  ) {
    space {
      snapshotId: id
    }
  }
}
`
