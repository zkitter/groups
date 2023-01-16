import { getGhGroup } from '../src'

const main = async () => {
  const ghGroup = await getGhGroup()
  console.log(ghGroup)
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
