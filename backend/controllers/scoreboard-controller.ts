import { Controller, Doc } from './controller.js'
import { Member } from '../models/member.js'
import mongoose, { QueryCursor } from 'mongoose'
import { Scoreboard, SCOREBOARD_MODEL_NAME, scoreboardSchema, scoreboardValidator } from '../models/scoreboard.js'

export interface ScoreboardDependencies {
  member: Controller<Member>
}

export class ScoreboardController extends Controller<Scoreboard> {
  constructor (db: mongoose.Connection, dependencies: ScoreboardDependencies) {
    super(db.model(SCOREBOARD_MODEL_NAME, scoreboardSchema), scoreboardValidator)

    // remove scores for members when they are deleted
    dependencies.member.on('deleted', async (other) => {
      const cursor: QueryCursor<Doc<Scoreboard>> = this.model.find({
        'scores.memberId': other._id
      }).cursor()
      await cursor.eachAsync(async (item) => {
        await item.updateOne({
          $pull: {
            scores: {
              memberId: other._id
            }
          }
        })
        const updated = await this.model.findById(item._id)
        if (updated != null) {
          this.emit('updated', updated)
        }
      })
    })
  }
}
