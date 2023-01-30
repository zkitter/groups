import { ValidationError } from 'express-validator'
import { CustomError } from './Custom'

export class RequestValidationError extends CustomError {
  statusCode = 400
  constructor(public errors: ValidationError[]) {
    super('Invalid request parameters')

    // because we are extending a built-in class
    Object.setPrototypeOf(this, RequestValidationError.prototype)
  }

  serializeErrors() {
    return {
      errors: this.errors.map(({ msg: message, param: field }) => {
        return { field, message }
      }),
    }
  }
}
