import 'express-async-errors'
import express, { Express } from 'express'
import { query } from 'express-validator'
import { Container } from 'typedi'
import { WhitelistController } from './controllers/Whitelist'

const app: Express = express()
const whitelistController = Container.get(WhitelistController)

app.get(
  '/whitelist',
  query('format').default('short').exists().isString().isIn(['long', 'short']),
  whitelistController.getWhitelist.bind(whitelistController),
)
app.get(
  '/whitelist/refresh',
  whitelistController.refresh.bind(whitelistController),
)

export { app }
