import mongoose from 'mongoose'
import Joi from 'joi'
import { idValidator } from './common.js'

export interface Group {
  name: string
}

export const groupModel = mongoose.model('Group', new mongoose.Schema<Group>({
  name: {
    type: String,
    required: true
  }
}))

export const groupValidator = Joi.object({
  _id: idValidator.required(),
  name: Joi.string().trim().required()
}).required()
