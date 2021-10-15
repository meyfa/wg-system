import { model, Schema } from 'mongoose'
import Joi from 'joi'
import { idValidator } from './common'

export interface Group {
  name: string
}

export const groupModel = model('Group', new Schema<Group>({
  name: {
    type: String,
    required: true
  }
}))

export const groupValidator = Joi.object({
  _id: idValidator.required(),
  name: Joi.string().trim().required()
}).required()
