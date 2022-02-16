import mongoose from 'mongoose'
import Joi from 'joi'
import { scoreboardModel } from './scoreboard.js'
import { idValidator } from './common.js'

export interface ManualChore {
  name: string
  dueSince: number
  scoreboardId: mongoose.Types.ObjectId | null
}

export const manualChoreModel = mongoose.model('ManualChore', new mongoose.Schema<ManualChore>({
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
    type: mongoose.Schema.Types.ObjectId,
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
