import { getCommittersGroup } from 'gh/get-committers-group'

const main = async () => {
  console.log('Fetching gh group (top 100 DAOs with >= 10_000 followers)...')
  const ghGroup = await getCommittersGroup()
  console.log(`Fetched gh group of size: ${ghGroup.length}`, ghGroup)
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
