import 'express-async-errors'
import express, { Express, Router } from 'express'
import { Container } from 'typedi'
import {
  HomeController,
  UserController,
  WhitelistController,
} from './controllers'

const app: Express = express()
const homeController = Container.get(HomeController)
const whitelistController = Container.get(WhitelistController)
const userController = Container.get(UserController)

app.get('/', homeController.home.bind(HomeController))

app.use(
  '/whitelist',
  Router()
    .get('', whitelistController.getWhitelist.bind(whitelistController))
    .get('/refresh', whitelistController.refresh.bind(whitelistController)),
)

app.use(
  '/user',
  Router()
    .get('/:username', userController.getUser.bind(userController))
    .get('/:username/refresh', userController.refresh.bind(userController)),
)

export { app }
