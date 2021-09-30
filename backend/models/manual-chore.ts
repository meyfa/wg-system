import mongoose, { Schema } from 'mongoose'
import Joi from 'joi'

export interface ManualChore {
  name: string
  dueSince: number
}

export const manualChoreModel = mongoose.model('ManualChore', new Schema<ManualChore>({
  name: {
    type: String,
    required: true
  },
  dueSince: {
    type: Number,
    required: true,
    min: 0
  }
}))

export const manualChoreValidator = Joi.object({
  _id: Joi.string().required(),
  name: Joi.string().trim().required(),
  dueSince: Joi.number().integer().min(0).required()
}).required()
