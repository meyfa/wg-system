import { Request, RequestHandler, Response } from 'express'
import { ApiError } from './errors'

export const HTTP_OK = 200
export const HTTP_CREATED = 201
export const HTTP_INTERNAL_SERVER_ERROR = 500

/**
 * Respond with an error message.
 *
 * @param res The response object.
 * @param code The status code to send.
 * @param message The message text.
 */
function sendError (res: Response, code: number, message: string): void {
  res.status(code).json({
    success: false,
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
  res.status(result.code ?? HTTP_OK).json({
    success: true,
    data: result.data
  })
}

export interface HandlerResponse<T = any> {
  /**
   * The response code. Defaults to HTTP_OK (200).
   */
  code?: number

  /**
   * The response data to be sent as JSON. If absent, no data is sent.
   */
  data?: T
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
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await fn(req)
      sendResult(res, result)
    } catch (error) {
      if (!(error instanceof ApiError)) {
        console.error(error)
        sendError(res, HTTP_INTERNAL_SERVER_ERROR, 'internal error')
        return
      }
      sendError(res, error.code, error.message)
    }
  }
}