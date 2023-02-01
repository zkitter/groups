import 'express-async-errors'
import cors from 'cors'
import express, { Express, Router } from 'express'
import swaggerUi from 'swagger-ui-express'
import { Container } from 'typedi'
import { UserController, WhitelistController } from './controllers'
import openApiSpecs from './openapi.json'

const app: Express = express()
const whitelistController = Container.get(WhitelistController)
const userController = Container.get(UserController)

app.use(cors())

app.use('/', swaggerUi.serve)
app.get('/', swaggerUi.setup(openApiSpecs))

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
