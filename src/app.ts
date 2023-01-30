import 'express-async-errors'
import express, { Express, Router } from 'express'
import { Container } from 'typedi'
import { UserController, WhitelistController } from './controllers'

const app: Express = express()
const whitelistController = Container.get(WhitelistController)
const userController = Container.get(UserController)

app.get(
  '/whitelist',
  query('format').default('short').exists().isString().isIn(['long', 'short']),
  whitelistController.getWhitelist.bind(whitelistController),
)

app.use(
  '/user',
  Router()
    .get('/:username', userController.getGroups.bind(userController))
    .get('/:username/refresh', userController.refresh.bind(userController)),
)

export { app }
