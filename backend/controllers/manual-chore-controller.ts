import { Controller } from './controller'
import { Document, QueryCursor } from 'mongoose'
import { broadcast } from '../websocket/events'
import { ManualChore, manualChoreModel, manualChoreValidator } from '../models/manual-chore'
import { Scoreboard } from '../models/scoreboard'

export interface ManualChoreDependencies {
  scoreboard: Controller<Scoreboard>
}

export class ManualChoreController extends Controller<ManualChore> {
  constructor (broadcastName: string, dependencies: ManualChoreDependencies) {
    super(manualChoreModel, manualChoreValidator, broadcastName)

    // unset scoreboards when they are deleted
    dependencies.scoreboard.on('deleted', async (other) => {
      const cursor: QueryCursor<Document<any, any, ManualChore>> = manualChoreModel.find({
        scoreboardId: other._id
      }).cursor()
      await cursor.eachAsync(async (item) => {
        item.set({ scoreboardId: null })
        const saved = await item.save()
        broadcast('update/' + broadcastName, saved)
      })
    })
  }
}
