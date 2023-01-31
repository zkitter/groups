import 'reflect-metadata'
import { app } from './app'

const start = async () => {
  console.log('Starting...')

  const { DATABASE_URL, GH_PAT } = process.env

  if (GH_PAT === undefined) throw new Error('GH_PAT not defined')
  if (DATABASE_URL === undefined) throw new Error('DATABASE_URL not defined')

  app.listen(8080)
}

start()
  .then(() => console.log(`👂 on port 8080`))
  .catch((err) => console.error(err))
