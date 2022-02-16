import { Controller } from './controller.js'
import mongoose from 'mongoose'
import { Group, GROUP_MODEL_NAME, groupSchema, groupValidator } from '../models/group.js'

export class GroupController extends Controller<Group> {
  constructor (db: mongoose.Connection) {
    super(db.model(GROUP_MODEL_NAME, groupSchema), groupValidator)
  }
}
