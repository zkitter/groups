import 'reflect-metadata'
import { app } from './app'

const start = async () => {
  console.log('Starting...')
  /*
    type guard for env variables
    in start function rather than route file
    so that error is caught right at app start
  */
  const { DATABASE_URL, GH_PAT } = process.env
  if (GH_PAT === undefined) throw new Error('GH_PAT not defined')
  if (DATABASE_URL === undefined) throw new Error('DATABASE_URL not defined')

  app.listen(3000)
}

start()
  .then(() => console.log('👂 on port 3000'))
  .catch((err) => console.error(err))
