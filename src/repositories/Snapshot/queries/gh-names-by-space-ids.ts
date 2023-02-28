export const ghNamesBySpaceIdsQuery = `
query GhNamesBySpaceIds($ids: [String]){
  spaces(
    where:{id_in: $ids}
  ) {
    snapshotId: id
    ghName: github
  }
}
`
