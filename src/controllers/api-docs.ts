import { Router } from 'express'
import swaggerUi from 'swagger-ui-express'
import openApiSpecs from '../../public/openapi.json'

export const apiDocsRouter = Router()
  .get('', (_, res) => {
    res.sendFile('public/openapi.json', { root: '.' })
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
