import { Router } from 'express'
import { createHandler, HTTP_CREATED } from './create-handler'
import { Controller } from '../controllers/controller'

export function createControllerRoute (controller: Controller<any>): Router {
  const router = Router()

  router.get('/', createHandler(async () => {
    return { data: await controller.list() }
  }))

  router.post('/', createHandler(async (req) => {
    return { code: HTTP_CREATED, data: await controller.create(req.body) }
  }))

  router.get('/:id', createHandler(async (req) => {
    return { data: await controller.find(req.params.id) }
  }))

  router.put('/:id', createHandler(async (req) => {
    await controller.update(req.params.id, req.body)
    return {}
  }))

  router.delete('/:id', createHandler(async (req) => {
    await controller.delete(req.params.id)
    return {}
  }))

  return router
}
