import { Controller } from './controller'
import { EnforceDocument, QueryCursor } from 'mongoose'
import { ManualChore, manualChoreModel, manualChoreValidator } from '../models/manual-chore'
import { Scoreboard } from '../models/scoreboard'

export interface ManualChoreDependencies {
  scoreboard: Controller<Scoreboard>
}

export class ManualChoreController extends Controller<ManualChore> {
  constructor (dependencies: ManualChoreDependencies) {
    super(manualChoreModel, manualChoreValidator)

    // unset scoreboards when they are deleted
    dependencies.scoreboard.on('deleted', async (other) => {
      const cursor: QueryCursor<EnforceDocument<ManualChore, {}>> = manualChoreModel.find({
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