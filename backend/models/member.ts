import { model, Schema, Types } from 'mongoose'
import Joi from 'joi'
import { idValidator } from './common'
import { groupModel } from './group'

const HEX_COLOR_REGEXP = /^#[0-9a-fA-F]{6}$/

export interface Member {
  name: string
  color: string
  active: boolean
  groups: Types.ObjectId[]
}

export const memberModel = model('Member', new Schema<Member>({
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
      type: Schema.Types.ObjectId,
      ref: groupModel
    }
  ]
}))

export const memberValidator = Joi.object({
  _id: idValidator.required(),
  name: Joi.string().trim().required(),
  color: Joi.string().pattern(HEX_COLOR_REGEXP).lowercase().required(),
  active: Joi.boolean().required(),
  groups: Joi.array().items(idValidator)
}).required()
