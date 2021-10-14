import { ErrorRequestHandler, Router } from 'express'
import { createHandler, handleError } from './create-handler'
import { NotFoundError } from './errors'
import { Controller } from '../controllers/controller'
import { createControllerRoute } from './controller-route'

export function createRouter (controllers: Record<string, Controller<unknown>>): Router {
  const router = Router()

  // blank index route
  router.get('/', createHandler(() => ({ data: {} })))

  // controller routes
  for (const [name, controller] of Object.entries(controllers)) {
    router.use(`/${name}`, createControllerRoute(controller))
  }

  // 404 fallback
  router.use(createHandler(() => {
    throw new NotFoundError('route')
  }))

  return router
}

export function createErrorHandler (): ErrorRequestHandler {
  return (err, req, res, next) => {
    if (res.headersSent) {
      return next(err)
    }
    handleError(err, res)
  }
}
