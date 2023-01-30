import 'express-async-errors'
import express, { Express } from 'express'
import { Container } from 'typedi'
import { WhitelistController } from './controllers/Whitelist'

const app: Express = express()
const whitelistController = Container.get(WhitelistController)

app.get(
  '/whitelist',
  whitelistController.findAllWhitelistedOrgs.bind(whitelistController),
)
app.get(
  '/whitelist/refresh',
  whitelistController.refresh.bind(whitelistController),
)

export { app }
