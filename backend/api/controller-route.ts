import { Router } from 'express'
import { createHandler } from './create-handler.js'
import { Controller } from '../controllers/controller.js'
import { HTTP_CREATED } from './constants.js'

export function createControllerRoute<T = any> (controller: Controller<T>): Router {
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
    return { data: await controller.update(req.params.id, req.body) }
  }))

  router.delete('/:id', createHandler(async (req) => {
    await controller.delete(req.params.id)
    return { data: {} }
  }))

  return router
}
