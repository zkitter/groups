export const spacesQuery = `
query Spaces($id_in: [String]){
  spaces(
    where:{id_in: $id_in}
  ) {
    github
  }
}
`
