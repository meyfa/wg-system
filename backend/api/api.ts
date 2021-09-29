import { Router } from 'express'
import { router as members } from './routes/members'
import { router as manualChores } from './routes/manual-chores'
import { createHandler } from './create-handler'
import { NotFoundError } from './errors'

export function createApiRouter (): Router {
  const router = Router()

  router.get('/', createHandler(() => ({ data: {} })))

  router.use('/members', members)
  router.use('/manual-chores', manualChores)

  // 404 fallback
  router.use(createHandler(() => {
    throw new NotFoundError('route')
  }))

  return router
}
