import { FastifyPluginAsync } from 'fastify'
import { Controller } from '../controllers/controller.js'
import { HttpStatus } from 'omniwheel'

export const createControllerRoute = <T = any>(controller: Controller<T>): FastifyPluginAsync => async (app) => {
  app.get('/', async () => {
    return await controller.list()
  })

  app.post('/', async (req, reply) => {
    return await reply.code(HttpStatus.CREATED).send(await controller.create(req.body))
  })

  app.get<{ Params: { id: string } }>('/:id', async (req) => {
    return await controller.find(req.params.id)
  })

  app.put<{ Params: { id: string } }>('/:id', async (req) => {
    return await controller.update(req.params.id, req.body)
  })

  app.delete<{ Params: { id: string } }>('/:id', async (req) => {
    await controller.delete(req.params.id)
    return {}
  })
}
