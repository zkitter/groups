import { body } from 'express-validator'

export default [
  body('maxOrgs').if(body('maxOrgs').exists()).isInt(),
  body('minFollowers').if(body('minFollowers').exists()).isInt(),
  body('since').if(body('minFollowers').exists()).isDate(),
  body('until').if(body('minFollowers').exists()).isDate(),
]
