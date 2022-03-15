import { Controller } from './controller.js'
import mongoose from 'mongoose'
import {
  MANUAL_CHORE_MODEL_NAME,
  ManualChore,
  manualChoreSchema,
  manualChoreValidator
} from '../models/manual-chore.js'
import { Scoreboard } from '../models/scoreboard.js'

export interface ManualChoreDependencies {
  scoreboard: Controller<Scoreboard>
}

export class ManualChoreController extends Controller<ManualChore> {
  constructor (db: mongoose.Connection, dependencies: ManualChoreDependencies) {
    super(db.model(MANUAL_CHORE_MODEL_NAME, manualChoreSchema), manualChoreValidator)

    // unset scoreboards when they are deleted
    dependencies.scoreboard.on('deleted', async (other) => {
      const cursor = this.model.find({
        scoreboardId: other._id
      }).cursor()
      await cursor.eachAsync(async (item) => {
        item.scoreboardId = null
        await item.save()
        this.emit('updated', item)
      })
    })
  }
}
