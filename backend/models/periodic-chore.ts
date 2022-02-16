import mongoose from 'mongoose'
import Joi from 'joi'
import { idValidator } from './common.js'
import { MEMBER_MODEL_NAME } from './member.js'
import { GROUP_MODEL_NAME } from './group.js'

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

export const PERIODIC_CHORE_MODEL_NAME = 'PeriodicChore'

export const periodicChoreSchema = new mongoose.Schema<PeriodicChore>({
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
      ref: GROUP_MODEL_NAME
    }
  ],
  entries: [
    {
      _id: false,
      memberId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: MEMBER_MODEL_NAME
      },
      date: {
        type: String,
        required: true
      }
    }
  ]
})

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
