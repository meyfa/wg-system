import { ErrorRequestHandler, Router } from 'express'
import { createHandler, handleError } from './create-handler'
import { NotFoundError } from './errors'
import { Controller } from '../controllers/controller'
import { createControllerRoute } from './controller-route'
import { memberModel, memberValidator } from '../models/member'
import { PeriodicChoreController } from '../controllers/periodic-chore-controller'
import { ManualChoreController } from '../controllers/manual-chore-controller'
import { ScoreboardController } from '../controllers/scoreboard-controller'

const membersController = new Controller(memberModel, memberValidator, 'members')
const scoreboardsController = new ScoreboardController('scoreboards', {
  member: membersController
})
const manualChoresController = new ManualChoreController('manual-chores', {
  scoreboard: scoreboardsController
})
const periodicChoresController = new PeriodicChoreController('periodic-chores', {
  member: membersController
})

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
