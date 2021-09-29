import { Router } from 'express'
import { createHandler, HTTP_CREATED } from '../create-handler'
import ManualChore from '../../models/manual-chore'
import { BadRequestError, NotFoundError } from '../errors'
import Joi from 'joi'
import { Types } from 'mongoose'
import { broadcast } from '../../websocket/events'

const schema = Joi.object({
  _id: Joi.any().strip(),
  name: Joi.string().trim().required(),
  dueSince: Joi.number().integer().min(0).required()
}).required()

export const router = Router()

router.get('/', createHandler(async () => ({ data: await ManualChore.find() })))

router.post('/', createHandler(async (req) => {
  const { value, error } = schema.validate(req.body)
  if (error != null) {
    throw new BadRequestError(error.message)
  }
  const item = await ManualChore.create(value)
  broadcast('add/manual-chores', item)
  return { code: HTTP_CREATED, data: item }
}))

router.get('/:id', createHandler(async (req) => {
  if (!Types.ObjectId.isValid(req.params.id)) {
    throw new NotFoundError()
  }
  const item = await ManualChore.findById(req.params.id)
  if (item == null) {
    throw new NotFoundError()
  }
  return { data: item }
}))

router.put('/:id', createHandler(async (req) => {
  if (!Types.ObjectId.isValid(req.params.id)) {
    throw new NotFoundError()
  }
  const item = await ManualChore.findById(req.params.id)
  if (item == null) {
    throw new NotFoundError()
  }
  const { value, error } = schema.validate(req.body)
  if (error != null) {
    throw new BadRequestError(error.message)
  }
  Object.assign(item, value)
  item.save()
  broadcast('update/manual-chores', item)
  return {}
}))

router.delete('/:id', createHandler(async (req) => {
  if (!Types.ObjectId.isValid(req.params.id)) {
    throw new NotFoundError()
  }
  const item = await ManualChore.findByIdAndDelete(req.params.id)
  if (item == null) {
    throw new NotFoundError()
  }
  broadcast('remove/manual-chores', item)
  return {}
}))
