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

app.use(express.static('public'))
app.use('/', swaggerUi.serve)
app.get(
  '/',
  swaggerUi.setup(openApiSpecs, {
    customfavIcon: '/favicon.ico',
    customSiteTitle: 'Zkitter Groups API',
  }),
)

app.use(
  '/whitelist',
  Router()
    .get('', whitelistController.getWhitelist.bind(whitelistController))
    .get('/refresh', whitelistController.refresh.bind(whitelistController))
    .get(
      '/daos',
      whitelistController.getWhitelistedDaos.bind(whitelistController),
    )
    .get(
      '/repos',
      whitelistController.getWhitelistedRepos.bind(whitelistController),
    ),
)

app.use(
  '/gh-user',
  Router()
    .get('/:username', userController.getUser.bind(userController))
    .get('/:username/refresh', userController.refresh.bind(userController)),
)

app.get(
  '/belongs-to-voters-group/:address',
  userController.belongsToVotersGroup.bind(userController),
)
app.get(
  '/belongs-to-gh-contributors-group/:ghUsername',
  userController.belongsToGhContributorsGroup.bind(userController),
)

export { app }
