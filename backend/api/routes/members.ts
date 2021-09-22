import { Router } from 'express'
import { createHandler, HTTP_CREATED } from '../create-handler'
import Member from '../../models/member'
import { BadRequestError, NotFoundError } from '../errors'
import Joi from 'joi'
import { Types } from 'mongoose'

const schema = Joi.object({
  _id: Joi.any().strip(),
  name: Joi.string().trim().required()
}).required()

export const router = Router()

router.get('/', createHandler(async () => ({ data: await Member.find() })))

router.post('/', createHandler(async (req) => {
  const { value, error } = schema.validate(req.body)
  if (error != null) {
    throw new BadRequestError(error.message)
  }
  const item = await Member.create(value)
  return { code: HTTP_CREATED, data: item }
}))

router.get('/:id', createHandler(async (req) => {
  if (!Types.ObjectId.isValid(req.params.id)) {
    throw new NotFoundError()
  }
  const item = await Member.findById(req.params.id)
  if (item == null) {
    throw new NotFoundError()
  }
  return { data: item }
}))

router.put('/:id', createHandler(async (req) => {
  if (!Types.ObjectId.isValid(req.params.id)) {
    throw new NotFoundError()
  }
  const item = await Member.findById(req.params.id)
  if (item == null) {
    throw new NotFoundError()
  }
  const { value, error } = schema.validate(req.body)
  if (error != null) {
    throw new BadRequestError(error.message)
  }
  Object.assign(item, value)
  item.save()
  return {}
}))

router.delete('/:id', createHandler(async (req) => {
  if (!Types.ObjectId.isValid(req.params.id)) {
    throw new NotFoundError()
  }
  const item = await Member.findByIdAndDelete(req.params.id)
  if (item == null) {
    throw new NotFoundError()
  }
  return {}
}))
