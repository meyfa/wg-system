import { model, Schema } from 'mongoose'
import Joi from 'joi'
import { idValidator } from './common'

const HEX_COLOR_REGEXP = /^#[0-9a-fA-F]{6}$/

export interface Member {
  name: string
  color: string
  active: boolean
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
  }
}))

export const memberValidator = Joi.object({
  _id: idValidator.required(),
  name: Joi.string().trim().required(),
  color: Joi.string().pattern(HEX_COLOR_REGEXP).lowercase().required(),
  active: Joi.boolean().required()
}).required()
