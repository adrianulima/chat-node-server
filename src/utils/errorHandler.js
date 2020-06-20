import HttpStatus from 'http-status-codes'

export class ItemNotFoundError extends Error {
  constructor(item, message) {
    super(message || `${item} not found`)
    this.name = this.constructor.name
    this.status = HttpStatus.NOT_FOUND
  }
}

export class InternalServerError extends Error {
  constructor(message) {
    super(message || `Internal Server Error`)
    this.name = this.constructor.name
    this.status = HttpStatus.INTERNAL_SERVER_ERROR
  }
}

export class MissingParamError extends Error {
  constructor(item, message) {
    super(message || `Param ${item} is missing`)
    this.name = this.constructor.name
    this.status = HttpStatus.BAD_REQUEST
  }
}

export class NotAutorizedError extends Error {
  constructor(message) {
    super(message || `Not authorized`)
    this.name = this.constructor.name
    this.status = HttpStatus.UNAUTHORIZED
  }
}

export const sendError = (res, error) => {
  res
    .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
    .json({ error: { message: error.message } })
}
