import { Request, RequestHandler, Response } from 'express'
import { ApiError } from './errors.js'
import { HttpStatus } from 'omniwheel'

/**
 * Respond with an error message.
 *
 * @param res The response object.
 * @param code The status code to send.
 * @param message The message text.
 */
function sendError (res: Response, code: number, message: string): void {
  res.status(code).json({
    error: message
  })
}

/**
 * Send a success response containing the given result data.
 *
 * @param res The response object.
 * @param result The result to send.
 */
function sendResult (res: Response, result: HandlerResponse): void {
  res.status(result.code ?? HttpStatus.OK).json(result.data ?? {})
}

export interface HandlerResponse<T = any> {
  /**
   * The response code. Defaults to OK (200).
   */
  code?: HttpStatus

  /**
   * The response data to be sent as JSON. If absent, no data is sent.
   */
  data: T
}

function isSyntaxErrorWithStatus (error: unknown): error is SyntaxError & { status: number } {
  return error instanceof SyntaxError && 'status' in error
}

/**
 * The error handling function that is used. This is called automatically when a request handler throws something,
 * but is also exposed here to be called manually from outside request handlers.
 *
 * @param error The error that occurred.
 * @param res The response object.
 */
export function handleError (error: unknown, res: Response): void {
  if (isSyntaxErrorWithStatus(error) && error.status >= 400 && error.status < 500) {
    // JSON input error
    sendError(res, HttpStatus.BAD_REQUEST, 'malformed input')
  } else if (error instanceof ApiError) {
    // one of our own errors
    sendError(res, error.code, error.message)
  } else {
    console.error(error)
    sendError(res, HttpStatus.INTERNAL_SERVER_ERROR, 'internal error')
  }
}

/**
 * Construct an Express RequestHandler that will invoke the given function when called.
 * The function may be asynchronous. If the function throws an error, an error response will be sent.
 * If the function returns a value instead of throwing, that value will be sent.
 *
 * Errors thrown are expected to be instances of ApiError, in which case their message will be forwarded
 * to the client to indicate he did something wrong. Errors not inheriting from ApiError will be treated
 * as bugs and status code 500 (Internal Server Error) will be sent, in addition to logging the error
 * (ApiErrors are never logged).
 *
 * @param fn The handler function (may return a Promise).
 * @returns The request handler.
 */
export function createHandler (fn: (req: Request) => HandlerResponse | Promise<HandlerResponse>): RequestHandler {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await fn(req)
      sendResult(res, result)
    } catch (error) {
      handleError(error, res)
    }
  }
}
