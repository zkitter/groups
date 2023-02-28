export const ghNamesBySpaceIdsQuery = `
query GhNamesBySpaceIds($ids: [String]){
  spaces(
    first: 1000
    where:{id_in: $ids}
  ) {
    snapshotId: id
    ghName: github
  }
}
`
