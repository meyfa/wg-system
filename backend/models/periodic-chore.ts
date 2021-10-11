import { model, Schema } from 'mongoose'
import Joi from 'joi'
import { idValidator } from './common'
import { memberModel } from './member'

export interface PeriodicChoreEntry {
  memberId: typeof Schema.Types.ObjectId
  date: string
}

export interface PeriodicChore {
  name: string
  period: number
  entries: PeriodicChoreEntry[]
}

export const periodicChoreModel = model('PeriodicChore', new Schema<PeriodicChore>({
  name: {
    type: String,
    required: true
  },
  period: {
    type: Number,
    required: true,
    min: 1
  },
  entries: [
    {
      _id: false,
      memberId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: memberModel
      },
      date: {
        type: String,
        required: true
      }
    }
  ]
}))

export const periodicChoreValidator = Joi.object({
  _id: idValidator.required(),
  name: Joi.string().trim().required(),
  period: Joi.number().integer().min(1).required(),
  entries: Joi.array().items(Joi.object({
    memberId: idValidator.required(),
    date: Joi.string().isoDate().required()
  })).sort({
    order: 'ascending',
    by: 'date'
  }).required()
}).required()
