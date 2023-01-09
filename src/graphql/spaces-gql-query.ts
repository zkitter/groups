export default `
query Spaces($id_in: [String]){
  spaces(
    where:{id_in: $id_in}
  ) {
    github
  }
}
`
