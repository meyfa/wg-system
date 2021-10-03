import { model, Schema } from 'mongoose'
import { memberModel } from './member'
import Joi from 'joi'
import { idValidator } from './common'

export interface ScoreboardEntry {
  memberId: typeof Schema.Types.ObjectId
  offset: number
  score: number
}

export interface Scoreboard {
  name: string
  scores: ScoreboardEntry[]
}

export const scoreboardModel = model('Scoreboard', new Schema<Scoreboard>({
  name: {
    type: String,
    required: true
  },
  scores: [
    {
      _id: false,
      memberId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: memberModel
      },
      offset: {
        type: Number,
        required: true
      },
      score: {
        type: Number,
        required: true
      }
    }
  ]
}))

export const scoreboardValidator = Joi.object({
  _id: idValidator.required(),
  name: Joi.string().trim().required(),
  scores: Joi.array().items(Joi.object({
    memberId: idValidator.required(),
    offset: Joi.number().integer().min(0).required(),
    score: Joi.number().integer().min(0).required()
  })).required()
}).required()
