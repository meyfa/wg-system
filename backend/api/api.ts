import { ErrorRequestHandler, Router } from 'express'
import { createHandler, handleError } from './create-handler'
import { NotFoundError } from './errors'
import { Controller } from '../controllers/controller'
import { createControllerRoute } from './controller-route'
import { memberModel, memberValidator } from '../models/member'
import { manualChoreModel, manualChoreValidator } from '../models/manual-chore'
import { scoreboardModel, scoreboardValidator } from '../models/scoreboard'
import { periodicChoreModel, periodicChoreValidator } from '../models/periodic-chore'

const membersController = new Controller(memberModel, memberValidator, 'members')
const manualChoresController = new Controller(manualChoreModel, manualChoreValidator, 'manual-chores')
const scoreboardsController = new Controller(scoreboardModel, scoreboardValidator, 'scoreboards')
const periodicChoresController = new Controller(periodicChoreModel, periodicChoreValidator, 'periodic-chores')

export function createApiRouter (): Router {
  const router = Router()

  router.get('/', createHandler(() => ({ data: {} })))

  router.use('/members', createControllerRoute(membersController))
  router.use('/manual-chores', createControllerRoute(manualChoresController))
  router.use('/scoreboards', createControllerRoute(scoreboardsController))
  router.use('/periodic-chores', createControllerRoute(periodicChoresController))

  // 404 fallback
  router.use(createHandler(() => {
    throw new NotFoundError('route')
  }))

  return router
}

export function createApiErrorHandler (): ErrorRequestHandler {
  return (err, req, res, next) => {
    if (res.headersSent) {
      return next(err)
    }
    handleError(err, res)
  }
}
