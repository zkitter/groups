import { Router } from 'express'
import swaggerUi from 'swagger-ui-express'
import openApiSpecs from './openapi.json'

export const apiDocsRouter: Router = Router()
  .get('', (_, res) => {
    res.sendFile('openapi.json', { root: '.' })
  })
  .use(
    '/ui',
    swaggerUi.serve,
    Router().get(
      '',
      swaggerUi.setup(openApiSpecs, {
        customfavIcon: '/public/favicon.ico',
        customSiteTitle: 'Zkitter Groups API',
      }),
    ),
  )
