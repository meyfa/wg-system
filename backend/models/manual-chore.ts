import { model, Schema, Types } from 'mongoose'
import Joi from 'joi'
import { scoreboardModel } from './scoreboard'
import { idValidator } from './common'

export interface ManualChore {
  name: string
  dueSince: number
  scoreboardId: Types.ObjectId | null
}

export const manualChoreModel = model('ManualChore', new Schema<ManualChore>({
  name: {
    type: String,
    required: true
  },
  dueSince: {
    type: Number,
    required: true,
    min: 0
  },
  scoreboardId: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: scoreboardModel
  }
}))

export const manualChoreValidator = Joi.object({
  _id: idValidator.required(),
  name: Joi.string().trim().required(),
  dueSince: Joi.number().integer().min(0).required(),
  scoreboardId: Joi.alt(idValidator, null).required()
}).required()
