export abstract class CustomError extends Error {
  abstract statusCode: number

  constructor(message: string) {
    super(message)

    // because we are extending a built-in class
    Object.setPrototypeOf(this, CustomError.prototype)
  }

  abstract serializeErrors(): {
    errors: Array<{ message: string; field?: string }>
  }
}
