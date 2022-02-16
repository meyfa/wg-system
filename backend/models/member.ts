import mongoose from 'mongoose'
import Joi from 'joi'
import { idValidator } from './common.js'
import { groupModel } from './group.js'

const HEX_COLOR_REGEXP = /^#[0-9a-fA-F]{6}$/

export interface Member {
  name: string
  color: string
  active: boolean
  groups: mongoose.Types.ObjectId[]
}

export const memberModel = mongoose.model('Member', new mongoose.Schema<Member>({
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true,
    match: HEX_COLOR_REGEXP
  },
  active: {
    type: Boolean,
    required: true
  },
  groups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: groupModel
    }
  ]
}))

export const memberValidator = Joi.object({
  _id: idValidator.required(),
  name: Joi.string().trim().required(),
  color: Joi.string().pattern(HEX_COLOR_REGEXP).lowercase().required(),
  active: Joi.boolean().required(),
  groups: Joi.array().items(idValidator).required()
}).required()
