import { Controller, Doc } from './controller.js'
import { QueryCursor } from 'mongoose'
import { ManualChore, manualChoreModel, manualChoreValidator } from '../models/manual-chore.js'
import { Scoreboard } from '../models/scoreboard.js'

export interface ManualChoreDependencies {
  scoreboard: Controller<Scoreboard>
}

export class ManualChoreController extends Controller<ManualChore> {
  constructor (dependencies: ManualChoreDependencies) {
    super(manualChoreModel, manualChoreValidator)

    // unset scoreboards when they are deleted
    dependencies.scoreboard.on('deleted', async (other) => {
      const cursor: QueryCursor<Doc<ManualChore>> = manualChoreModel.find({
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
