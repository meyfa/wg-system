import { Request, Response, Router } from 'express'

export function createApiRouter (): Router {
  const router = Router()

  router.get('/', (req: Request, res: Response) => res.status(200).json({}))

  router.use((req: Request, res: Response) => {
    res.status(404).json({
      error: 'endpoint not found'
    })
  })

  return router
}
