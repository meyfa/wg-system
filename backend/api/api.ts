import { Router } from 'express'
import { router as members } from './routes/members'
import { createHandler } from './create-handler'
import { NotFoundError } from './errors'

export function createApiRouter (): Router {
  const router = Router()

  router.get('/', createHandler(() => ({ data: {} })))

  router.use('/members', members)

  // 404 fallback
  router.use(createHandler(() => {
    throw new NotFoundError('route')
  }))

  return router
}
