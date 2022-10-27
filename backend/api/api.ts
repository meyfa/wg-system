import { FastifyError, FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify'
import { ApiError, BadRequestError, InternalServerError, NotFoundError } from './errors.js'
import { Controller } from '../controllers/controller.js'
import { createControllerRoute } from './controller-route.js'

export type ErrorHandler = (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => Promise<void>

export const createRouter = (controllers: Record<string, Controller<unknown>>): FastifyPluginAsync => async (app) => {
  // blank index route
  app.get('/', () => ({}))

  // controller routes
  for (const [name, controller] of Object.entries(controllers)) {
    await app.register(createControllerRoute(controller), { prefix: `/${name}` })
  }

  // 404 fallback
  app.all('/*', async (req, reply) => reply.callNotFound())
  app.setNotFoundHandler(async (req, reply) => await sendError(reply, new NotFoundError('route')))
}

export function createErrorHandler (): ErrorHandler {
  return async (error, req, reply) => {
    if (error instanceof SyntaxError && error.statusCode != null && error.statusCode >= 400 && error.statusCode < 500) {
      // JSON input error
      return await sendError(reply, new BadRequestError('malformed input'))
    } else if (error instanceof ApiError) {
      // one of our own errors
      return await sendError(reply, error)
    } else {
      console.error(error)
      return await sendError(reply, new InternalServerError())
    }
  }
}

async function sendError (reply: FastifyReply, error: ApiError): Promise<FastifyReply> {
  return await reply.code(error.code).send({
    error: error.message
  })
}
