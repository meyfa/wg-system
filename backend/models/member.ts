import { model, Schema } from 'mongoose'
import Joi from 'joi'
import { idValidator } from './common'

export interface Member {
  name: string
}

export const memberModel = model('Member', new Schema<Member>({
  name: {
    type: String,
    required: true
  }
}))

export const memberValidator = Joi.object({
  _id: idValidator.required(),
  name: Joi.string().trim().required()
}).required()
