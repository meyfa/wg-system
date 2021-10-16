import { Controller, Doc } from './controller'
import { Member } from '../models/member'
import { QueryCursor } from 'mongoose'
import { Scoreboard, scoreboardModel, scoreboardValidator } from '../models/scoreboard'

export interface ScoreboardDependencies {
  member: Controller<Member>
}

export class ScoreboardController extends Controller<Scoreboard> {
  constructor (dependencies: ScoreboardDependencies) {
    super(scoreboardModel, scoreboardValidator)

    // remove scores for members when they are deleted
    dependencies.member.on('deleted', async (other) => {
      const cursor: QueryCursor<Doc<Scoreboard>> = scoreboardModel.find({
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
        const updated = await scoreboardModel.findById(item._id)
        if (updated != null) {
          this.emit('updated', updated)
        }
      })
    })
  }
}
