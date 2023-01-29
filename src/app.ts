import 'express-async-errors'
import express, { Express } from 'express'
import { Container } from 'typedi'
import { WhitelistController } from './controllers/Whitelist'

const app: Express = express()
const whitelistController = Container.get(WhitelistController)

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.get('/whitelist', whitelistController.refresh.bind(whitelistController))

export { app }
