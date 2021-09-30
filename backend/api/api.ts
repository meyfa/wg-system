import { Router } from 'express'
import { createHandler } from './create-handler'
import { NotFoundError } from './errors'
import { Controller } from '../controllers/controller'
import { createControllerRoute } from './controller-route'
import { memberModel, memberValidator } from '../models/member'
import { manualChoreModel, manualChoreValidator } from '../models/manual-chore'

const membersController = new Controller(memberModel, memberValidator, 'members')
const manualChoresController = new Controller(manualChoreModel, manualChoreValidator, 'manual-chores')

export function createApiRouter (): Router {
  const router = Router()

  router.get('/', createHandler(() => ({ data: {} })))

  router.use('/members', createControllerRoute(membersController))
  router.use('/manual-chores', createControllerRoute(manualChoresController))

  // 404 fallback
  router.use(createHandler(() => {
    throw new NotFoundError('route')
  }))

  return router
}
