import mongoose, { Schema } from 'mongoose'
import Joi from 'joi'

export interface Member {
  name: string
}

export const memberModel = mongoose.model('Member', new Schema<Member>({
  name: {
    type: String,
    required: true
  }
}))

export const memberValidator = Joi.object({
  _id: Joi.string().required(),
  name: Joi.string().trim().required()
}).required()
