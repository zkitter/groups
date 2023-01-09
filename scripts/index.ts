import { hideBin } from 'yargs/helpers'
import yargs from 'yargs/yargs'

import { getSpaces } from '../src'

const options = {
  min: {
    alias: 'm',
    describe: 'DAO min number of followers on snapshot.org',
    type: 'number',
  },
  size: {
    alias: 's',
    describe: 'number of org to fetch from snapshot.org. 0 means no limit',
    type: 'number',
  },
}

// @ts-expect-error
const argv = yargs(hideBin(process.argv)).options(options).help().argv as {
  min: number
  size: number
}

const main = async () => {
  const spaces = await getSpaces({ min: argv.min, size: argv.size })()
  console.log(spaces)
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
