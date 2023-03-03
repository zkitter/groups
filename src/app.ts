import 'express-async-errors'
import cors from 'cors'
import express, { Express } from 'express'
import favicon from 'serve-favicon'
import {
  apiDocsRouter,
  membershipRouter,
  userRouter,
  whitelistRouter,
} from './controllers'

const app: Express = express()
  .use([cors(), favicon('public/favicon.ico')])
  .use('/public', express.static('public'))
  .get('/', (_, res) => {
    res.redirect('/api-docs/ui')
  })
  .use('/api-docs', apiDocsRouter)
  .use('/whitelist', whitelistRouter)
  .use('/gh-user', userRouter)
  .use('/membership', membershipRouter)

export { app }
