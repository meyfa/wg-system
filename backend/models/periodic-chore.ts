import mongoose from 'mongoose'
import Joi from 'joi'
import { idValidator } from './common.js'
import { memberModel } from './member.js'
import { groupModel } from './group.js'

export interface PeriodicChoreEntry {
  memberId: mongoose.Types.ObjectId
  date: string
}

export interface PeriodicChore {
  name: string
  period: number
  groups: mongoose.Types.ObjectId[]
  entries: PeriodicChoreEntry[]
}

export const periodicChoreModel = mongoose.model('PeriodicChore', new mongoose.Schema<PeriodicChore>({
  name: {
    type: String,
    required: true
  },
  period: {
    type: Number,
    required: true,
    min: 1
  },
  groups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: groupModel
    }
  ],
  entries: [
    {
      _id: false,
      memberId: {
        type: mongoose.Schema.Types.ObjectId,
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
  groups: Joi.array().items(idValidator).required(),
  entries: Joi.array().items(Joi.object({
    memberId: idValidator.required(),
    date: Joi.string().isoDate().required()
  })).sort({
    order: 'ascending',
    by: 'date'
  }).required()
}).required()
